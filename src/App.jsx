import React, { useState } from "react";
import { FaFolder, FaFile } from "react-icons/fa";
import { AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";
import "./App.css";

function FileExplorer() {
  const [toggle, setToggle] = useState(false);
  const [iconToggle, setIconToggle] = useState("");
  const [text, setText] = useState("");
  const [selectedParent, setSelectedParent] = useState(null);

  const [files, setFiles] = useState([
    {
      name: "root",
      type: "folder",
      children: [],
    },
  ]);

  const handleAddFolderClick = (parent) => {
    setIconToggle("FaFolder");
    setText("");
    setToggle(true);
    setSelectedParent(parent);
  };

  const handleAddFileClick = (parent) => {
    setIconToggle("FaFile");
    setText("");
    setToggle(true);
    setSelectedParent(parent);
  };

  const handleAddFolder = () => {
    if (iconToggle === "FaFolder" && selectedParent) {
      const folderName = text;
      if (folderName) {
        const newFolder = {
          name: folderName,
          type: "folder",
          children: [],
        };
        selectedParent.children.push(newFolder);
        setFiles([...files]);
        setToggle(false);
        setSelectedParent(null);
      }
    }
  };

  const handleAddFile = () => {
    if (iconToggle === "FaFile" && selectedParent) {
      const fileName = text;
      if (fileName) {
        const newFile = {
          name: fileName,
          type: "file",
        };
        selectedParent.children.push(newFile);
        setFiles([...files]);
        setToggle(false);
        setSelectedParent(null);
      }
    }
  };

  const handleDeleteFile = (parent, index) => {
    parent.children.splice(index, 1);
    setFiles([...files]);
  };

  const handleDeleteFolder = (child, childIndex, parent) => {
    parent.children.splice(childIndex, 1);
    setFiles([...files]);
  };

  const handleRename = (parent, index) => {
    const newName = text;
    if (newName) {
      parent.children[index].name = newName;
      setFiles([...files]);
    }
  };

  const renderChildren = (children, parent) => {
    return (
      <ul>
        {children.map((child, childIndex) => (
          <React.Fragment key={childIndex}>
            <li>
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
                  <AiOutlineDelete
                    className="icon"
                    onClick={() =>
                      handleDeleteFolder(child, childIndex, parent)
                    }
                  />
                  {renderChildren(child.children, child)}
                </>
              )}
              {child.type === "file" && (
                <>
                  <AiOutlineDelete
                    className="icon"
                    onClick={() => handleDeleteFile(parent, childIndex)}
                  />
                  <AiOutlinePlus
                    className="icon"
                    onClick={() => handleRename(parent, childIndex)}
                  />
                </>
              )}
            </li>
          </React.Fragment>
        ))}
      </ul>
    );
  };

  return (
    <div className="fileExplorer">
      <ul>
        {files.map((item, index) => (
          <li key={index}>
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
              <AiOutlinePlus className="icon" />
            </div>
            <div>{renderChildren(item.children, item)}</div>
            {toggle && (
              <div>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                {iconToggle === "FaFolder" ? (
                  <FaFolder onClick={handleAddFolder} />
                ) : (
                  <FaFile onClick={handleAddFile} />
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
