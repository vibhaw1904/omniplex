import React, { useRef, useState } from "react";
import styles from "./Prompt.module.css";
import Image from "next/image";

import Arrow from "../../../public/svgs/Arrow.svg";
import Retry from "../../../public/svgs/Retry.svg";
import Fork from "../../../public/svgs/Fork.svg";
import Stop from "../../../public/svgs/Stop.svg";

type Props = {
  fork?: boolean;
  error: string;
  block: boolean;
  streaming: boolean;
  handleSend: (text: string) => void;
  handleCancel: () => void;
  handleRetry: () => void;
  handleFork: () => void;
};

const Prompt = (props: Props) => {
  const [text, setText] = useState("");
  const [fileName,setFileName]=useState("");
  const hiddenFileInput = useRef<HTMLInputElement | null>(null);

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey && text.trim() !== "") {
      event.preventDefault();
      props.handleSend(text);
      setText("");
      setFileName("");
    }
  };
 
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFileName(file.name);
      const body = new FormData();
      body.append("file", file);
    
    }
  };
  
  const handleClick = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  return (
    <>
      {props.fork ? (
        <div className={styles.forkContainer} onClick={props.handleFork}>
          <div className={styles.promptContainer}>
            <div className={styles.promptText}>Fork Thread</div>
            <div className={styles.retryButton}>
              <Image src={Fork} alt="Fork" width={24} height={24} />
            </div>
          </div>
        </div>
      ) : props.error.length > 0 ? (
        <div className={styles.retryContainer} onClick={props.handleRetry}>
          <div className={styles.promptContainer}>
            <div className={styles.promptText}>Try Again</div>
            <div className={styles.retryButton}>
              <Image src={Retry} alt="Return" width={24} height={24} />
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.container}>
        <div className={styles.promptContainer}>
          <input
            disabled={props.streaming || props.block}
            placeholder="Ask anything..."
            className={styles.promptText}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleEnter}
          />
            {fileName && (
              <div className={styles.fileName}>{fileName}</div>
            )}
            {props.streaming ? (
              <div className={styles.stopButton} onClick={props.handleCancel}>
                <Image src={Stop} alt="Stop" width={24} height={24} />
              </div>
            ) : (
              <div className={styles.actionsContainer}>
                <input
                  type="file"
                  ref={hiddenFileInput}
                  onChange={handleChange}
                  style={{display: 'none'}}
                  accept=".pdf,.doc,.docx,.txt"
                />
                <div className={styles.fileInputLabel} onClick={handleClick}>
                  <Image src='/attach.png' alt="Attach" width={28} height={28} />
                </div>
                <div
                  className={styles.sendButton}
                  style={{
                    opacity: (text.trim() !== "" || fileName) ? 1 : 0.5,
                  }}
                  onClick={() => {
                    if (text.trim() !== "" || fileName) {
                      props.handleSend(text);
                      setText("");
                      setFileName("");
                    }
                  }}                >
                  <Image src={Arrow} alt="Arrow" width={24} height={24} />
                </div>
                  
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Prompt;
