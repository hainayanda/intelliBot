import { Token } from "../model/Token";
import { Util } from "./Util";
import { Uri, TextLine, Range, Location, Position } from "vscode";
import { TokenLine } from "../model/TokenLine";
import { TokenType } from "../model/TokenType";
import { Instruction } from "../model/Instruction";

'use strict'

export class ProcedureAnalyzer {
    public static analyzeKeywordHeader(uri : Uri, line : TextLine) : TokenLine {
        let tokens : Token[] = Util.extractComment(uri, line);
        let text = line.text;
        if(tokens.length > 0) text = Util.removeCommentFrom(line);
        text = text.trimRight();
        if(text.length == 0) return new TokenLine(line, tokens);
        let instructions = Util.extractInstruction(uri, line)
        for(let i = 0; i < instructions.length; i++){
            let instruction = instructions[i];
            if(i == 0) tokens.push(Token.getInstance(instruction, TokenType.KeywordHeader))
            else tokens.push(Token.getInstance(instruction, TokenType.UnExpectedToken))
        }
        return new TokenLine(line, tokens);
    }

    public static analyzeTestCaseHeader(uri : Uri, line : TextLine) : TokenLine {
        let tokens : Token[] = Util.extractComment(uri, line);
        let text = line.text;
        if(tokens.length > 0) text = Util.removeCommentFrom(line);
        text = text.trimRight();
        if(text.length == 0) return new TokenLine(line, tokens);
        let instructions = Util.extractInstruction(uri, line)
        for(let i = 0; i < instructions.length; i++){
            let instruction = instructions[i];
            if(i == 0) tokens.push(Token.getInstance(instruction, TokenType.TestCaseHeader))
            else tokens.push(Token.getInstance(instruction, TokenType.UnExpectedToken))
        }
        return new TokenLine(line, tokens);
    }

    public static analyzeKeywordReturn(uri : Uri, line : TextLine) : TokenLine {
        let tokens : Token[] = Util.extractComment(uri, line);
        let text = line.text;
        if(tokens.length > 0) text = Util.removeCommentFrom(line);
        text = text.trimRight();
        if(text.length == 0) return new TokenLine(line, tokens);
        let instructions = Util.extractInstruction(uri, line)
        for(let i = 0; i < instructions.length; i++){
            let instruction = instructions[i];
            if(i == 0) tokens.push(Token.getInstance(instruction, TokenType.KeywordAttribute))
            else if (i == 1){
                if(/^\$\{[^\{\}]+\}$/g.test(instruction.text)) tokens.push(Token.getInstance(instruction, TokenType.VariablePointer))
                else tokens.push(Token.getInstance(instruction, TokenType.PlainStaticValue))
            }
            else tokens.push(Token.getInstance(instruction, TokenType.UnExpectedToken))
        }
        return new TokenLine(line, tokens);
    }

    public static analyzePotentialKeywordArgument(uri : Uri, line : TextLine) : TokenLine {
        let tokens : Token[] = Util.extractComment(uri, line);
        let text = line.text;
        if(tokens.length > 0) text = Util.removeCommentFrom(line);
        text = text.trimRight();
        if(text.length == 0) return new TokenLine(line, tokens);
        let instructions = Util.extractInstruction(uri, line)
        if(!(/^\[Arguments?\]\s{2,}$/g.test(text))) return this.analyzeProcedureLine(uri, line);
        for(let i = 0; i < instructions.length; i++){
            let instruction = instructions[i];
            if(i == 0) tokens.push(Token.getInstance(instruction, TokenType.KeywordAttribute));
            else if(/^\$\{[^\{\}]+\}$/g.test(instruction.text)) 
                tokens.push(Token.getInstance(instruction, TokenType.VariableDeclaration));
            else tokens.push(Token.getInstance(instruction, TokenType.UnExpectedToken))
        }
        return new TokenLine(line, tokens);
    }

    public static analyzeProcedureLine(uri : Uri, line : TextLine) : TokenLine {
        let tokens : Token[] = Util.extractComment(uri, line);
        let text = line.text;
        if(tokens.length > 0) text = Util.removeCommentFrom(line);
        text = text.trimRight();
        if(text.length == 0) return new TokenLine(line, tokens);
        let instructions = Util.extractInstruction(uri, line)
        let isCanBeVarDeclaration = true;
        let isCanBeKeywordCalling = true;
        let isStartOfTheInstruction = true;
        for(let i = 0; i < instructions.length; i++){
            let instruction = instructions[i];
            if(isStartOfTheInstruction){
                if(/^[\$\@]\{[\{\}]+\}$/g.test(instruction.text)){
                    tokens.push(Token.getInstance(instruction, TokenType.VariableDeclaration))
                    isCanBeVarDeclaration = false;
                    isStartOfTheInstruction = false;
                }
                else if(/^[\$\@]\{[\{\}]+\}\s?=$/g.test(instruction.text)){
                    tokens = tokens.concat(this.splitDeclarationAssignment(uri, line.lineNumber, instruction))
                    isStartOfTheInstruction = false;
                }
                else if(/^\.{2,}$/g.test(instruction.text) || /^[\\\/]{1,}$/g.test(instruction.text))
                    tokens.push(Token.getInstance(instruction, TokenType.ScopeSign))
                else if(/^(ELSE|else|Else)$/g.test(instruction.text))
                    tokens.push(Token.getInstance(instruction, TokenType.Control))
                else if(/^Run Keywords?(\s\w+)+$/g.test(instruction.text))
                    tokens.push(Token.getInstance(instruction, TokenType.Control))
                else if(/^:(FOR|For|for)$/g.test(instruction.text))
                    tokens.push(Token.getInstance(instruction, TokenType.Control))
                else if(/\$\{[\{\}]+\}/g.test(instruction.text))
                    tokens.push(Token.getInstance(instruction, TokenType.UnExpectedToken))
                else{
                    tokens.push(Token.getInstance(instruction, TokenType.KeywordPointer))
                    isCanBeKeywordCalling = false;
                    let isStartOfTheInstruction = false;
                }
            }
            else{
                if(isCanBeVarDeclaration && /^[\$\@]\{[\{\}]+\}\s?=$/g.test(instruction.text))
                    tokens = tokens.concat(this.splitDeclarationAssignment(uri, line.lineNumber, instruction))
                else if(/^\$\{[\{\}]+\}$/g.test(instruction.text))
                    tokens.push(Token.getInstance(instruction, TokenType.VariablePointer))
                else if(/\$\{[\{\}]+\}/g.test(instruction.text))
                    tokens = tokens.concat(Util.splitPlainWithVariable(uri, line.lineNumber, instruction))
                else if(instruction.text == "PASS" || instruction.text == "FAIL")
                    tokens.push(Token.getInstance(instruction, TokenType.PlainStaticValue))
                else if(isCanBeKeywordCalling){
                    tokens.push(Token.getInstance(instruction, TokenType.KeywordPointer))
                    isCanBeKeywordCalling = false;
                }
                else tokens.push(Token.getInstance(instruction, TokenType.PlainStaticValue))
            }
        }
        return new TokenLine(line, tokens);
    }

    public static splitDeclarationAssignment(uri: Uri, lineNumber : number, instruction : Instruction) : Token[]{
        let tokens : Token[] = [];
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
}