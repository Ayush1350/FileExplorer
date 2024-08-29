import { useState } from "react";
import { FaFolder, FaFile } from "react-icons/fa";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import "./App.css";
import { v4 as uuidv4 } from "uuid";

function FileExplorer() {
  const [toggle, setToggle] = useState({
    value: false,
    icon: "",
  });
  const [text, setText] = useState("");
  const [selectedParent, setSelectedParent] = useState(null);
  const [renameId, setRenameId] = useState(null);
  const [renameText, setRenameText] = useState("");

  const [files, setFiles] = useState([
    {
      name: "root",
      type: "folder",
      id: uuidv4(),
      children: [],
    },
  ]);

  const handleAddFolderClick = (parent) => {
    console.log(parent);

    setText("");
    setToggle({ value: true, icon: "Folder" });
    setSelectedParent(parent);
  };

  const handleAddFolder = () => {
    const folderName = text;
    if (folderName) {
      const newFolder = {
        name: folderName,
        id: uuidv4(),
        type: "folder",
        children: [],
      };
      selectedParent.children.push(newFolder);
      setToggle(false);
      setSelectedParent(null);
    }
  };

  const handleAddFileClick = (parent) => {
    setText("");
    setToggle({ value: true, icon: "File" });
    setSelectedParent(parent);
  };

  const handleAddFile = () => {
    const fileName = text;
    if (fileName) {
      const newFile = {
        name: fileName,
        type: "file",
        id: uuidv4(),
      };
      selectedParent.children.push(newFile);
      setToggle(false);
      setSelectedParent(null);
    }
  };

  const handleDeleteFile = (parent, id) => {
    console.log(parent);
    console.log(id);
    parent.children = parent.children.filter((child) => child.id !== id);
    setFiles([...files]);
  };

  const handleDeleteFolder = (parent, id) => {
    console.log(parent);
    console.log(id);
    parent.children = parent.children.filter((child) => child.id !== id);
    setFiles([...files]);
  };

  const handleRenameClick = (parent, id) => {
    const child = parent.children.find((child) => child.id === id);
    setRenameId(id);
    setRenameText(child.name);
  };

  const handleRename = (parent, id) => {
    if (renameText) {
      const child = parent.children.find((child) => child.id === id);
      child.name = renameText;
      setFiles([...files]);
      setRenameId(null);
      setRenameText("");
    }
  };

  const renderChildren = (children, parent) => {
    return (
      <ul>
        {children.map((child) => (
          <div key={child.id}>
            <li>
              {renameId === child.id ? (
                <>
                  <input
                    type="text"
                    value={renameText}
                    onChange={(e) => setRenameText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleRename(parent, child.id);
                      }
                    }}
                    autoFocus
                  />
                </>
              ) : (
                <>
                  <span>{child.name}</span>
                  {child.type === "folder" && (
                    <>
                      <FaFolder
                        className="icon"
                        onClick={() => handleAddFolderClick(child)}
                      />
                      <FaFile
                        className="icon"
                        onClick={() => handleAddFileClick(child)}
                      />
                      <AiOutlineEdit
                        className="icon"
                        onClick={() => handleRenameClick(parent, child.id)}
                      />
                      <AiOutlineDelete
                        className="icon"
                        onClick={() => handleDeleteFolder(parent, child.id)}
                      />
                    </>
                  )}
                  {child.type === "file" && (
                    <>
                      <AiOutlineEdit
                        className="icon"
                        onClick={() => handleRenameClick(parent, child.id)}
                      />
                      <AiOutlineDelete
                        className="icon"
                        onClick={() => handleDeleteFile(parent, child.id)}
                      />
                    </>
                  )}
                </>
              )}
              {child.type === "folder" && renderChildren(child.children, child)}
            </li>
          </div>
        ))}
      </ul>
    );
  };

  return (
    <div className="fileExplorer">
      <ul>
        {files.map((item) => (
          <li key={item.id}>
            <div>
              <span>{item.name}</span>
              <FaFolder
                className="icon"
                onClick={() => handleAddFolderClick(item)}
              />
              <FaFile
                className="icon"
                onClick={() => handleAddFileClick(item)}
              />
            </div>
            <div>{renderChildren(item.children, item)}</div>
            {toggle.value && (
              <div>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  autoFocus
                />
                {toggle.icon == "Folder" ? (
                  <FaFolder className="icon" onClick={handleAddFolder} />
                ) : (
                  <FaFile className="icon" onClick={handleAddFile} />
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FileExplorer;
