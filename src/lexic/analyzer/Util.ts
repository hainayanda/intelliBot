import { Uri, TextLine, Range, Position, Location } from "vscode";
import { TokenType } from "../model/TokenType";
import { TokenLine } from "../model/TokenLine";
import { Token } from "../model/Token";
import { Instruction } from "../model/Instruction";

'use strict'

export class Util {

    public static createSectionHeaderTokenLine(uri : Uri, line : TextLine, type : TokenType) : TokenLine{
        let text = line.text.trimRight()
        let range = new Range(new Position(line.lineNumber, 0), new Position(line.lineNumber, text.length - 1));
        let location = new Location(uri, range)
        let token = new Token(location, text, type)
        return new TokenLine(line, [ token ])
    }
    
    public static extractKeywordArgument(instruction : Instruction): Token{
        if(/^\$\{[^\{\}]+\}$/g.test(instruction.text)) return Token.getInstance(instruction, TokenType.VariableReference)
        else return Token.getInstance(instruction, TokenType.PlainStaticValue)
    }

    public static extractKeywordPointer(instruction : Instruction): Token[]{
        let tokens : Token[] = [];
        if(/^\$\{[^\{\}]+\}$/g.test(instruction.text)) return [Token.getInstance(instruction, TokenType.VariableReference)];
        let subInstruction = instruction.text.split('.');
        let uri = instruction.location.uri;
        let lineNumber = instruction.location.range[0].lineNumber
        let start = instruction.location.range.start.character;
        for(let i = 0; i < subInstruction.length; i++){
            let sub = subInstruction[i];
            let end = start + sub.length - 1;
            if(sub.length == 0) {
                let dotRange = new Range(
                new Position(lineNumber, start + 1),
                new Position(lineNumber, start + 1))
                tokens.push(new Token(new Location(uri, dotRange), sub, TokenType.UnExpectedToken))
                end = start;
            }
            else{
                let range = new Range(
                    new Position(lineNumber, start),
                    new Position(lineNumber, end))
                if(i == 0 && subInstruction.length > 1) {
                    tokens.push(new Token(new Location(uri, range), sub, TokenType.ResourceReference))
                    let dotRange = new Range(
                        new Position(lineNumber, end + 1),
                        new Position(lineNumber, end + 1))
                    tokens.push(new Token(new Location(uri, dotRange), sub, TokenType.Specifier))
                }
                else if(i == 0 || i == 1) tokens.push(new Token(new Location(uri, range), sub, TokenType.KeywordReference));
                else tokens.push(new Token(new Location(uri, range), sub, TokenType.UnExpectedToken));
            }
            start = end + 2;
        }
        return tokens;
    }

    public static extractInstruction(uri: Uri, line : TextLine): Instruction[]{
        let instructions : Instruction[] = [];
        let text = line.text.trimRight();
        let instructionTexts = text.split(/\s{2,}/g);
        let i = 0;
        instructionTexts.forEach(instructionText => {
            let start = text.indexOf(instructionText, i);
            i = start + instructionText.length;
            let end = i - 1;
            let range = new Range(
                new Position(line.lineNumber, start), 
                new Position(line.lineNumber, end));
            let location = new Location(uri, range);
            instructions.push(new Instruction(instructionText, location))
        });
        return instructions;
    }

    public static getSpaceRange(text : string, start: number, lineNumber : number) : Range{
        let i = start;
        for(; i < text.length; i++){
            if(text.charAt(i) != ' ') break;
        }
        if(i == start) return null;
        else return new Range(new Position(lineNumber, start), new Position(lineNumber, i))
    }

    public static removeCommentFrom(line : TextLine) : string {
        let text = line.text.trimRight();
        let commentRange = this.getCommentRange(line);
        if(commentRange != null){
            return text.substr(0, commentRange.start.character);
        }
        else return line.text;
    }

    public static getCommentToken(uri : Uri, line: TextLine) : Token {
        let commentRange = this.getCommentRange(line);
        if(commentRange != null){
            return new Token(new Location(uri, commentRange), line.text.trimRight(), TokenType.Comment)
        }
        else return null;
    }

    public static getCommentRange(line : TextLine) : Range {
        let text = line.text.trimRight();
        if(/^\s*#/g.test(text)){
            return new Range(
                new Position(line.lineNumber, 0),
                new Position(line.lineNumber, text.length-1));
        }
        else if(!(/#/g.test(text))) return null;
        else if(/^[^#]\\#/g.test(text)) return null;
        else{
            let start = text.indexOf('#');
            return new Range(
                new Position(line.lineNumber, start), 
                new Position(line.lineNumber, text.length - 1));
        }
    }

    public static extractComment(uri: Uri, line : TextLine) : Token[]{
        let tokens : Token[] = [];
        let commentToken = this.getCommentToken(uri, line);
        if(commentToken != null) tokens.push(commentToken);
        return tokens;
    }

    public static getPlainStaticValueToken(uri : Uri, start: number, end : number, lineNumber : number, instruction : Instruction) : Token{
        let range = new Range(new Position(lineNumber, start), new Position(lineNumber, end));
        let location = new Location(uri, range);
        let text = instruction.text.substring(start, end);
        return new Token(location, text, TokenType.PlainStaticValue);
    }
}