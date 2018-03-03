import { Token } from "../model/Token";
import { Util } from "./Util";
import { Uri, TextLine, Range, Location, Position } from "vscode";
import { TokenLine } from "../model/TokenLine";
import { TokenType } from "../model/TokenType";
import { Instruction } from "../model/Instruction";
import { VariableAnalyzer } from "./VariableAnalyzer";

'use strict'

export class ProcedureAnalyzer {

    private static analyzeProcedureHeader(uri : Uri, line : TextLine, procedureType : TokenType) : TokenLine {
        let tokens : Token[] = Util.extractComment(uri, line);
        let text = line.text;
        if(tokens.length > 0) text = Util.removeCommentFrom(line);
        text = text.trimRight();
        if(text.length == 0) return new TokenLine(line, tokens);
        let instructions = Util.extractInstruction(uri, line)
        for(let i = 0; i < instructions.length; i++){
            let instruction = instructions[i];
            if(i == 0) tokens.push(Token.getInstance(instruction, procedureType))
            else tokens.push(Token.getInstance(instruction, TokenType.UnExpectedToken))
        }
        return new TokenLine(line, tokens);
    }
    public static analyzeKeywordHeader(uri : Uri, line : TextLine) : TokenLine {
        return this.analyzeProcedureHeader(uri, line, TokenType.KeywordHeader);
    }

    public static analyzeTestCaseHeader(uri : Uri, line : TextLine) : TokenLine {
        return this.analyzeProcedureHeader(uri, line, TokenType.TestCaseHeader);
    }

    public static analyzeReturnKeyword(uri : Uri, line : TextLine) : TokenLine {
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
                if(/^\$\{[^\{\}]+\}$/g.test(instruction.text)) tokens.push(Token.getInstance(instruction, TokenType.VariableReference))
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
            else if(/^[\$\@\&]\{[^\{\}]+\}$/g.test(instruction.text)) 
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
                if(/^[\$\@\&]\{[\{\}]+\}$/g.test(instruction.text)){
                    tokens.push(Token.getInstance(instruction, TokenType.VariableDeclaration))
                    isCanBeVarDeclaration = false;
                    isStartOfTheInstruction = false;
                }
                else if(/^[\$\@\&]\{[\{\}]+\}\s?=$/g.test(instruction.text)){
                    tokens = tokens.concat(VariableAnalyzer.splitDeclarationAssignment(uri, line.lineNumber, instruction))
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
                    tokens.push(Token.getInstance(instruction, TokenType.KeywordReference))
                    isCanBeKeywordCalling = false;
                    let isStartOfTheInstruction = false;
                }
            }
            else{
                if(isCanBeVarDeclaration && /^[\$\@\&]\{[\{\}]+\}\s?=$/g.test(instruction.text))
                    tokens = tokens.concat(VariableAnalyzer.splitDeclarationAssignment(uri, line.lineNumber, instruction))
                else if(/^\$\{[\{\}]+\}$/g.test(instruction.text)){
                    tokens.push(Token.getInstance(instruction, TokenType.VariableReference))
                    isCanBeVarDeclaration = false;
                }
                else if(/\$\{[\{\}]+\}/g.test(instruction.text)){
                    tokens = tokens.concat(VariableAnalyzer.splitPlainWithVariable(uri, line.lineNumber, instruction))
                    isCanBeVarDeclaration = false;
                }
                else if(instruction.text == "PASS" || instruction.text == "FAIL"){
                    tokens.push(Token.getInstance(instruction, TokenType.PlainStaticValue))
                    isCanBeVarDeclaration = false;
                }
                else if(isCanBeKeywordCalling){
                    tokens.push(Token.getInstance(instruction, TokenType.KeywordReference))
                    isCanBeKeywordCalling = false;
                    isCanBeVarDeclaration = false;
                }
                else tokens.push(Token.getInstance(instruction, TokenType.PlainStaticValue))
            }
        }
        return new TokenLine(line, tokens);
    }
}