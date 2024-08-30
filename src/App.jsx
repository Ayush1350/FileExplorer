import { useMemo, useState, useCallback } from "react";
import { FaFolder, FaFile } from "react-icons/fa";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import "./App.css";
import { v4 as uuidv4 } from "uuid";

function FileExplorer() {
  const [toggle, setToggle] = useState({
    value: false,
    fileValue: false,
    folderValue: false,
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

  const handleAddFolderClick = useCallback(
    (parent) => {
      setText("");
      if (toggle.folderValue) {
        setToggle({
          folderValue: false,
          value: false,
          icon: "",
        });
        setRenameId("");
        setSelectedParent(null);
      } else {
        setToggle({
          folderValue: true,
          value: true,
          icon: "Folder",
        });
        setRenameId("");
        setSelectedParent(parent);
      }
    },
    [toggle.folderValue]
  );

  const handleAddFileClick = useCallback(
    (parent) => {
      setText("");
      if (toggle.fileValue) {
        setToggle({
          fileValue: false,
          value: false,
          icon: "",
        });
        setRenameId("");
        setSelectedParent(null);
      } else {
        setToggle({
          fileValue: true,
          value: true,
          icon: "File",
        });
        setRenameId("");
        setSelectedParent(parent);
      }
    },
    [toggle.fileValue]
  );

  const handleIconClick = useCallback(() => {
    if (selectedParent && toggle.icon === "Folder") {
      const folderName = text;
      if (folderName) {
        const newFolder = {
          name: folderName,
          id: uuidv4(),
          type: "folder",
          children: [],
        };
        selectedParent.children.push(newFolder);
        setToggle({
          renameValue: false,
          fileValue: false,
          folderValue: false,
          value: false,
        });
        setSelectedParent(null);
      }
    } else if (selectedParent && toggle.icon === "File") {
      const fileName = text;
      if (fileName) {
        const newFile = {
          name: fileName,
          type: "file",
          id: uuidv4(),
        };
        selectedParent.children.push(newFile);
        setToggle({
          fileValue: false,
          folderValue: false,
          value: false,
        });
        setSelectedParent(null);
      }
    }
  }, [selectedParent, text, toggle.icon]);

  const handleDelete = useCallback(
    (parent, id) => {
      parent.children = parent.children.filter((child) => child.id !== id);
      setFiles([...files]);
    },
    [files]
  );

  const handleRenameClick = (parent, id) => {
    setToggle({
      fileValue: false,
      value: false,
      icon: "",
    });

    const child = parent.children.find((child) => child.id === id);
    setRenameId(id);
    setRenameText(child.name);
  };

  const handleRename = useCallback(
    (parent, id) => {
      if (renameText) {
        const child = parent.children.find((child) => child.id === id);
        child.name = renameText;
        setFiles([...files]);
        setRenameId(null);
        setRenameText("");
      }
    },
    [renameText, files]
  );

  const renderChildren = useMemo(() => {
    const render = (children, parent) => {
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
                    <AiOutlineEdit
                      className="icon"
                      onClick={() => handleRename(parent, child.id)}
                    />
                  </>
                ) : (
                  <>
                    <span>{child.name}</span>
                    {child.type === "folder" && (
                      <>
                        <FaFolder
                          className="icon folderIcon"
                          onClick={() => handleAddFolderClick(child)}
                        />
                        <FaFile
                          className="icon fileIcon"
                          onClick={() => handleAddFileClick(child)}
                        />
                        <AiOutlineEdit
                          className="icon editIcon"
                          onClick={() => handleRenameClick(parent, child.id)}
                        />
                        <AiOutlineDelete
                          className="icon deleteIcon"
                          onClick={() => handleDelete(parent, child.id)}
                        />
                      </>
                    )}
                    {child.type === "file" && (
                      <>
                        <AiOutlineEdit
                          className="icon editIcon"
                          onClick={() => handleRenameClick(parent, child.id)}
                        />
                        <AiOutlineDelete
                          className="icon deleteIcon"
                          onClick={() => handleDelete(parent, child.id)}
                        />
                      </>
                    )}
                  </>
                )}
                {child.type === "folder" && render(child.children, child)}
              </li>
            </div>
          ))}
        </ul>
      );
    };

    return render;
  }, [renameId, renameText, handleRename, handleRenameClick]);

  return (
    <div className="fileExplorer">
      <span id="headerSpan">File Explorer</span>
      <ul>
        {files.map((item) => (
          <li key={item.id}>
            <div>
              <span>{item.name}</span>
              <FaFolder
                className="icon folderIcon"
                onClick={() => handleAddFolderClick(item)}
              />
              <FaFile
                className="icon fileIcon"
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleIconClick();
                    }
                  }}
                  autoFocus
                />
                {toggle.icon === "Folder" ? (
                  <FaFolder
                    className="icon folderIcon"
                    onClick={handleIconClick}
                  />
                ) : (
                  <FaFile className="icon fileIcon" onClick={handleIconClick} />
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
