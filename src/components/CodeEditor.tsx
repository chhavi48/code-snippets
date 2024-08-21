import React, { useState, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  solarizedlight,
  atomDark,
  darcula,
  coy,
  dracula,
  nightOwl,
  okaidia,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import styled from "styled-components";
import * as htmlToImage from "html-to-image";

// Define available themes
const themes = {
  dark: vscDarkPlus,
  light: solarizedlight,
  atom: atomDark,
  darcula: darcula,
  coy: coy,
  dracula: dracula,
  nightOwl: nightOwl,
  okaidia: okaidia,
} as const;

type ThemeKeys = keyof typeof themes;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #1a1a1a;
  min-height: 100vh;
  color: #fff;
`;

const CodeContainer = styled.div`
  background: linear-gradient(135deg, #b993d6 0%, #8ca6db 100%);
  padding: 32px;
  border-radius: 12px;
  position: relative;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.25);
  margin-bottom: 20px;
`;

const TitleBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px 8px 0 0;
`;

const WindowControls = styled.div`
  display: flex;
  gap: 8px;
`;

const ControlDot = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  background-color: ${(props) => props.color};
  border-radius: 50%;
`;

const EditorContainer = styled.div`
  border-radius: 0 0 12px 12px;
  overflow: hidden;
`;

const FileNameInput = styled.input`
  background: transparent;
  border: none;
  color: white;
  font-size: 16px;
  outline: none;
  text-align: center;
`;

const SettingsPanel = styled.div`
  display: flex;
  gap: 16px;
  background: #2c2c2c;
  padding: 16px;
  border-radius: 8px;
  align-items: center;
  margin-top: 16px;
`;

const ExportButton = styled.button`
  padding: 8px 16px;
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #ff3333;
  }
`;

const CodeImageGenerator: React.FC = () => {
  const [code, setCode] = useState<string>(
    `import { Detail } from "@raycast/api";\nexport default function Command() {\n  return <Detail markdown="Hello World" />;\n}`
  );
  const [theme, setTheme] = useState<ThemeKeys>("dark");
  const [fontSize, setFontSize] = useState<number>(16);
  const [bgColor, setBgColor] = useState<string>("#282c34");
  const [fileName, setFileName] = useState<string>("Untitled-1");
  const editorRef = useRef<HTMLDivElement>(null);

  const handleExport = () => {
    if (editorRef.current) {
      htmlToImage.toPng(editorRef.current).then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${fileName}.png`;
        link.href = dataUrl;
        link.click();
      });
    }
  };

  return (
    <Container>
      <h2>Code Images</h2>
      <CodeContainer ref={editorRef}>
        <TitleBar>
          <WindowControls>
            <ControlDot color="#ff5f56" />
            <ControlDot color="#ffbd2e" />
            <ControlDot color="#27c93f" />
          </WindowControls>
          <FileNameInput
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Untitled-1"
          />
        </TitleBar>
        <EditorContainer>
          <div
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => setCode(e.currentTarget.innerHTML)} // Preserve HTML content
            style={{
              padding: "20px",
              fontSize: `${fontSize}px`,
              fontFamily: "monospace",
              backgroundColor: bgColor,
              borderRadius: "8px",
              whiteSpace: "pre-wrap",
              color: "#fff",
            }}
          >
            <SyntaxHighlighter
              language="javascript"
              style={themes[theme]}
              customStyle={{ fontSize: `${fontSize}px` }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        </EditorContainer>
      </CodeContainer>

      <SettingsPanel>
        <div>
          <label>Theme: </label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as ThemeKeys)}
          >
            {Object.keys(themes).map((themeKey) => (
              <option key={themeKey} value={themeKey}>
                {themeKey.charAt(0).toUpperCase() + themeKey.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Font Size: </label>
          <input
            type="number"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            min={10}
            max={24}
          />
        </div>

        <div>
          <label>Background Color: </label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
          />
        </div>

        <ExportButton onClick={handleExport}>Export Image</ExportButton>
      </SettingsPanel>
    </Container>
  );
};

export default CodeImageGenerator;
