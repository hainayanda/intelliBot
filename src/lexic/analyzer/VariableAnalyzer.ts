import { Uri, TextLine, Range, Position, Location } from "vscode";
import { TokenLine } from "../model/TokenLine";
import { Token } from "../model/Token";
import { TokenType } from "../model/TokenType";
import { Instruction } from "../model/Instruction";
import { Util } from "./Util";

'use strict'

export class VariableAnalyzer {

    public static analyzeArrayVariableLine(uri: Uri, line: TextLine): TokenLine {
        let tokens: Token[] = Util.extractComment(uri, line);
        let text = line.text;
        if (tokens.length > 0) text = Util.removeCommentFrom(line);
        text = text.trimRight();
        if (text.length == 0) return new TokenLine(line, tokens);
        let instructions = Util.extractInstruction(uri, line)
        if (instructions.length > 0)
            tokens.push(Token.getInstance(instructions[0], TokenType.VariableDeclaration));
        for (let i = 1; i < instructions.length; i++) {
            let instruction = instructions[i];
            tokens = tokens.concat(this.splitPlainWithVariable(uri, line.lineNumber, instruction));
        }
        return new TokenLine(line, tokens);
    }

    public static analyzeDictionaryVariableLine(uri: Uri, line: TextLine): TokenLine {
        let tokens: Token[] = Util.extractComment(uri, line);
        let text = line.text;
        if (tokens.length > 0) text = Util.removeCommentFrom(line);
        text = text.trimRight();
        if (text.length == 0) return new TokenLine(line, tokens);
        let instructions = Util.extractInstruction(uri, line)
        if (instructions.length > 0)
            tokens.push(Token.getInstance(instructions[0], TokenType.VariableDeclaration));
        let isValue = true;
        for (let i = 1; i < instructions.length; i++) {
            let instruction = instructions[i];
            if (/^[=]\s?+=\s?[=]+/g.test(instruction.text)) {
                if (isValue) tokens.push(Token.getInstance(instruction, TokenType.UnExpectedToken));
                else tokens = tokens.concat(this.splitKeyAndValue(uri, line.lineNumber, instruction));
            }
            else {
                if (isValue) {
                    tokens = tokens.concat(this.splitPlainWithVariable(uri, line.lineNumber, instruction));
                    isValue = false;
                }
                else {
                    tokens = tokens.concat(this.splitPlainWithVariable(uri, line.lineNumber, instruction));
                    isValue = true;
                }
            }
        }
        return new TokenLine(line, tokens);
    }

    private static splitKeyAndValue(uri: Uri, lineNumber: number, instruction: Instruction): Token[] {
        let tokens: Token[] = [];
        let subInstructions = instruction.text.split('=');
        let keyStart = instruction.location.range.start.character;
        let keyEnd = keyStart + subInstructions[0].length - 1
        if (subInstructions[0].charAt(subInstructions[0].length - 1) == ' ') keyEnd--;
        let keyRange = new Range(new Position(lineNumber, keyStart), new Position(lineNumber, keyEnd));
        let keyLocation = new Location(uri, keyRange);
        tokens.push(new Token(keyLocation, subInstructions[0].trimRight(), TokenType.PlainStaticValue));

        let valueStart = keyStart + subInstructions[0].length + 1
        let valueEnd = valueStart + subInstructions[1].length - 1
        if (subInstructions[0].charAt(0) == ' ') valueStart++;
        let valueRange = new Range(new Position(lineNumber, valueStart), new Position(lineNumber, valueEnd));
        let valueLocation = new Location(uri, valueRange);
        if (/\$\{[\{\}]+\}/g.test(subInstructions[1]))
            tokens = tokens.concat(this.splitPlainWithVariable(uri, lineNumber, new Instruction(subInstructions[0].trimLeft(), valueLocation)));
        else tokens.push(new Token(keyLocation, subInstructions[0].trimLeft(), TokenType.PlainStaticValue));

        let assignIndex = instruction.text.indexOf('=') + instruction.location.range.start.character;
        let assignLocation = new Location(uri, new Position(lineNumber, assignIndex));
        tokens.push(new Token(assignLocation, '=', TokenType.Assignment));
        return tokens;

    }

    public static analyzeDictionaryAssignment(uri: Uri, line: TextLine): TokenLine {
        let tokens: Token[] = Util.extractComment(uri, line);
        let text = line.text;
        if (tokens.length > 0) text = Util.removeCommentFrom(line);
        text = text.trimRight();
        if (text.length == 0) return new TokenLine(line, tokens);
        let instructions = Util.extractInstruction(uri, line)
        let start = 0;
        if (/^\.{2,}/g.test(instructions[start].text)) {
            tokens.push(Token.getInstance(instructions[start], TokenType.ScopeSign));
            start = 1;
        }
        let isValue = true;
        for (let i = 1; start < instructions.length; i++) {
            let instruction = instructions[i];
            if (/^[=]\s?+=\s?[=]+/g.test(instruction.text)) {
                if (isValue) tokens.push(Token.getInstance(instruction, TokenType.UnExpectedToken));
                else tokens = tokens.concat(this.splitKeyAndValue(uri, line.lineNumber, instruction));
            }
            else {
                if (isValue) {
                    tokens = tokens.concat(this.splitPlainWithVariable(uri, line.lineNumber, instruction));
                    isValue = false;
                }
                else {
                    tokens = tokens.concat(this.splitPlainWithVariable(uri, line.lineNumber, instruction));
                    isValue = true;
                }
            }
        }
        return new TokenLine(line, tokens);
    }

    public static analyzeArrayAssignment(uri: Uri, line: TextLine): TokenLine {
        let tokens: Token[] = Util.extractComment(uri, line);
        let text = line.text;
        if (tokens.length > 0) text = Util.removeCommentFrom(line);
        text = text.trimRight();
        if (text.length == 0) return new TokenLine(line, tokens);
        let instructions = Util.extractInstruction(uri, line)
        let start = 0;
        if (/^\.{2,}/g.test(instructions[start].text)) {
            tokens.push(Token.getInstance(instructions[start], TokenType.ScopeSign));
            start = 1;
        }
        for (let i = start; i < instructions.length; i++) {
            let instruction = instructions[i];
            tokens = tokens.concat(this.splitPlainWithVariable(uri, line.lineNumber, instruction));
        }
        return new TokenLine(line, tokens);
    }

    public static splitDeclarationAssignment(uri: Uri, lineNumber: number, instruction: Instruction): Token[] {
        let tokens: Token[] = [];
        let start = instruction.location.range.start
        let end = instruction.text.lastIndexOf('}');
        let range = new Range(start, new Position(lineNumber, end));
        let location = new Location(uri, range);
        let variable = instruction.text.substring(0, end);
        tokens.push(new Token(location, variable, TokenType.VariableDeclaration));
        tokens.push(new Token(
            new Location(
                uri, new Position(lineNumber, instruction.text.length - 1)),
            '=', TokenType.Assignment));
        return tokens;
    }

    public static splitPlainWithVariable(uri: Uri, lineNumber: number, instruction: Instruction): Token[] {
        let tokens: Token[] = [];
        let matches = instruction.text.match(/\$\{[\{\}]+\}/g);
        matches.forEach(match => {
            let start = 0
            let index = instruction.text.indexOf(match, start);
            while (index != -1) {
                start = index + match.length;
                let end = start - 1;
                let range = new Range(new Position(lineNumber, index), new Position(lineNumber, end));
                let location = new Location(uri, range);
                tokens.push(new Token(location, match, TokenType.VariableReference));
                index = instruction.text.indexOf(match, start);
            }
        });
        tokens.sort((a, b) => {
            let aPos = a.location.range.start.character
            let bPos = b.location.range.start.character
            if (aPos < bPos) return -1;
            else if (aPos > bPos) return 1;
            else return 0;
        });
        if (tokens.length == 1) {
            let start = 0;
            let end = tokens[0].location.range.start.character - 1;
            if (end != start && end >= 0)
                tokens.push(Util.getPlainStaticValueToken(uri, start, end, lineNumber, instruction));
            start = tokens[0].location.range.end.character + 1;
            end = instruction.text.length - 1;
            tokens.push(Util.getPlainStaticValueToken(uri, start, end, lineNumber, instruction));
        }
        else if (tokens.length > 1) {
            let start = 0;
            let end = tokens[0].location.range.start.character - 1;
            if (end != start && end >= 0)
                tokens.push(Util.getPlainStaticValueToken(uri, start, end, lineNumber, instruction));
            for (let i = 1; i < tokens.length - 1; i++) {
                let firstToken = tokens[i];
                let secondToken = tokens[i + 1]
                let start = firstToken.location.range.end.character + 1;
                let end = secondToken.location.range.start.character - 1;
                tokens.push(Util.getPlainStaticValueToken(uri, start, end, lineNumber, instruction));
            }
            let lastToken = tokens[tokens.length - 1];
            let lastIndex = lastToken.location.range.end.character;
            end = instruction.text.length - 1
            if (lastIndex < end) {
                let start = lastIndex + 1;
                tokens.push(Util.getPlainStaticValueToken(uri, start, end, lineNumber, instruction));
            }
        }
        return tokens;
    }
}