import { TextDocument, TextLine, Location, Range, Position, Uri } from "vscode";
import { TokenDocument } from "../model/TokenDocument";
import { TokenLine } from "../model/TokenLine";
import { Token } from "../model/Token";
import { TokenType } from "../model/TokenType";
import { Resource } from "../../structure/model/member/Resource";
import { Instruction } from "../model/Instruction";
import { Util } from "./Util";
import { ProcedureAnalyzer } from "./ProcedureAnalyzer";
import { VariableAnalyzer } from "./VariableAnalyzer";
import { TokenScope } from "../model/TokenScope";
'use strict'

enum Section {
    Nothing, Keywords, Settings, Variables, TestCases
}

enum SettingsSection {
    Nothing, Resource, Setup, Other
}

export class LexicAnalyzer {

    public static analyze(textDocument : TextDocument) : Thenable<TokenDocument>{
        return new Promise<TokenDocument>((resolve, reject) => {
            let section = Section.Nothing;
            let keywords : TokenLine[][] = [];
            let testCases : TokenLine[][] = [];
            let settings : TokenLine[];
            let globalVariables : TokenLine[];
            let others : TokenLine[] = [];

            let uri = textDocument.uri;
            let isLineCanBeArgument = false;
            let isLineCanBeReturn = false;
            let isLineCanBeDictionaryAssignment = false;
            let isLineCanBeArrayAssignment = false;
            for(let i = 0; i < textDocument.lineCount; i++){
                let line = textDocument.lineAt(i);
                let text = line.text.trimRight();
                if(/^\*{3,}\s*Keywords?\s*\*{3,}\s*$/g.test(text)) {
                    section = Section.Keywords
                    others.push(
                        Util.createSectionHeaderTokenLine(
                            uri, line, TokenType.KeywordSectionHeader))
                }
                else if(/^\*{3,}\s*Variables?\s*\*{3,}\s*$/g.test(text)) {
                    section = Section.Variables
                    others.push(
                        Util.createSectionHeaderTokenLine(
                            uri, line, TokenType.GlobalVariablesSectionHeader))
                }
                else if(/^\*{3,}\s*Test Cases?\s*\*{3,}\s*$/g.test(text)) {
                    section = Section.TestCases
                    others.push(
                        Util.createSectionHeaderTokenLine(
                            uri, line, TokenType.TestCasesSectionHeader))
                }
                else if(/^\*{3,}\s*Settings?\s*\*{3,}\s*$/g.test(text)) {
                    section = Section.Settings
                    others.push(
                        Util.createSectionHeaderTokenLine(
                            uri, line, TokenType.SettingsSectionHeader))
                }
                else if(text.length == 0) continue;
                else{
                    switch(section){
                        case Section.Keywords : {
                            if(isLineCanBeArgument) {
                                keywords[keywords.length - 1].push(ProcedureAnalyzer.analyzePotentialKeywordArgument(uri, line));
                                isLineCanBeArgument = false;
                                isLineCanBeReturn = true;
                            }
                            else if(isLineCanBeReturn && /^\s{2,}\[Return\]\s{2,}/g.test(text)){
                                keywords[keywords.length - 1].push(ProcedureAnalyzer.analyzeReturnKeyword(uri, line));
                                isLineCanBeReturn = false;
                            }
                            else if(/^[^#]/g.test(text) && /^\S+/g.test(text)){
                                keywords.push([]);
                                keywords[keywords.length - 1].push(ProcedureAnalyzer.analyzeKeywordHeader(uri, line));
                                isLineCanBeArgument = true;
                            }
                            else keywords[keywords.length - 1].push(ProcedureAnalyzer.analyzeProcedureLine(uri, line));
                        }
                        case Section.TestCases : {
                            if(/^[^#]/g.test(text) && /^\S+/g.test(text)){
                                testCases.push([]);
                                testCases[testCases.length - 1].push(ProcedureAnalyzer.analyzeTestCaseHeader(uri, line));
                            }
                            else testCases[testCases.length - 1].push(ProcedureAnalyzer.analyzeProcedureLine(uri, line));
                        }
                        case Section.Variables : {
                            if(/^\$\{[\{\}]\}\s{2,}/g.test(text)){
                                isLineCanBeDictionaryAssignment = false;
                                isLineCanBeArrayAssignment = false;
                            }
                            else if(/^\&\{[\{\}]\}\s{2,}/g.test(text)){
                                globalVariables.push(VariableAnalyzer.analyzeDictionaryVariableLine(uri, line));
                                isLineCanBeDictionaryAssignment = true;
                                isLineCanBeArrayAssignment = false;
                            }
                            else if(/^\@\{[\{\}]\}\s{2,}/g.test(text)){
                                globalVariables.push(VariableAnalyzer.analyzeArrayVariableLine(uri, line));
                                isLineCanBeArrayAssignment = true;
                                isLineCanBeDictionaryAssignment = false;
                            }
                            else if(isLineCanBeDictionaryAssignment)
                                globalVariables.push(VariableAnalyzer.analyzeDictionaryAssignment(uri, line));
                            else if(isLineCanBeArrayAssignment)
                                globalVariables.push(VariableAnalyzer.analyzeArrayAssignment(uri, line));
                            else globalVariables.push(this.analyzeNothing(uri, line));
                        }
                        case Section.Settings : settings.push(this.analyzeSettingsLine(uri, line));
                        default : settings.push(this.analyzeNothing(uri, line));
                    }
                }
            }
            return new TokenDocument(textDocument, this.getScopeInstances(keywords), 
                this.getScopeInstances(testCases), new TokenScope(settings), 
                new TokenScope(globalVariables), others)
        });
    }

    private static getScopeInstances(tokenLines : TokenLine[][]) : TokenScope[]{
        let scope : TokenScope[] = []
        tokenLines.forEach(line => {
            scope.push(new TokenScope(line))
        });
        return scope
    }

    public static analyzeSettingsLine(uri : Uri, line : TextLine) : TokenLine {
        let tokens : Token[] = Util.extractComment(uri, line);
        let text = line.text;
        if(tokens.length > 0) text = Util.removeCommentFrom(line);
        text = text.trimRight();
        if(text.length == 0) return new TokenLine(line, tokens);
        if(/^\s+/g.test(text)){
            let spaceRange = Util.getSpaceRange(text, 0, line.lineNumber);
            let afterRange = new Range(
                new Position(line.lineNumber, spaceRange.end.character + 1), 
                new Position(line.lineNumber, text.length - 1))
            tokens.push(new Token(new Location(uri, spaceRange), text, TokenType.UnExpectedSpace));
            tokens.push(new Token(new Location(uri, afterRange), text, TokenType.Unknown))
        }
        let instructions = Util.extractInstruction(uri, line)
        let i = 0;
        let settingsSection = SettingsSection.Nothing
        instructions.forEach(instruction => {
            if(i == 0){
                if(instruction.text == "Resource"){
                    settingsSection = SettingsSection.Resource;
                    tokens.push(Token.getInstance(instruction, TokenType.SettingsType))
                }
                else if(instruction.text == "Test Setup" 
                        || instruction.text == "Test Teardown" 
                        || instruction.text == "Suite Setup"){
                    settingsSection = SettingsSection.Setup;
                    tokens.push(Token.getInstance(instruction, TokenType.SettingsType))
                }
                else if(instruction.text == "Test Timeout" 
                        || instruction.text == "Documentation"){
                        settingsSection = SettingsSection.Other;
                        tokens.push(Token.getInstance(instruction, TokenType.SettingsType))
                }
                else {
                    settingsSection = SettingsSection.Setup;
                    tokens.push(Token.getInstance(instruction, TokenType.Unknown))
                }
            }
            else if(i == 1){
                switch(settingsSection){
                    case SettingsSection.Resource : tokens.push(Token.getInstance(instruction, TokenType.ResourceUri))
                    case SettingsSection.Setup : tokens = tokens.concat(Util.extractKeywordPointer(instruction))
                    case SettingsSection.Other : tokens.push(Util.extractKeywordArgument(instruction))
                    default : tokens.push(Token.getInstance(instruction, TokenType.Unknown))
                }
            }
            else{
                switch(settingsSection){
                    case SettingsSection.Resource : tokens.push(Token.getInstance(instruction, TokenType.UnExpectedToken))
                    case SettingsSection.Setup : tokens = tokens.concat(Util.extractKeywordArgument(instruction))
                    case SettingsSection.Other : tokens.push(Util.extractKeywordArgument(instruction))
                    default : tokens.push(Token.getInstance(instruction, TokenType.Unknown))
                }
            }
            i++;
        });
        return new TokenLine(line, tokens);
    }

    public static analyzeVariablesLine(uri : Uri, line : TextLine) : TokenLine {
        let tokens : Token[] = Util.extractComment(uri, line);
        let text = line.text;
        if(tokens.length > 0) text = Util.removeCommentFrom(line);
        text = text.trimRight();
        if(text.length == 0) return new TokenLine(line, tokens);
        //NEED IMPLEMENTATION
        return new TokenLine(line, tokens);
    }

    public static analyzeNothing(uri : Uri, line : TextLine) : TokenLine {
        let tokens : Token[] = Util.extractComment(uri, line);
        let text = line.text;
        if(tokens.length > 0) text = Util.removeCommentFrom(line);
        text = text.trimRight();
        if(text.length == 0) return new TokenLine(line, tokens);
        else{
            let range = new Range(new Position(line.lineNumber, 0), new Position(line.lineNumber, text.length - 1));
            let location = new Location(uri, range);
            tokens.push(new Token(location, text, TokenType.UnExpectedToken))
        }
        return new TokenLine(line, tokens);
    }
}