"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import styles from "./ArticleShareButton.module.css";

type ArticleShareButtonProps = {
  title: string;
};

export default function ArticleShareButton({
  title,
}: ArticleShareButtonProps) {
  const [status, setStatus] = useState("");

  async function shareArticle() {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        setStatus("Article shared.");
        return;
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setStatus("Article link copied.");
        return;
      }

      setStatus(`Copy this article link: ${url}`);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setStatus(`Unable to share. Copy this article link: ${url}`);
    }
  }

  return (
    <div className={styles.share}>
      <button className={styles.button} onClick={shareArticle} type="button">
        Share <Share2 size={16} aria-hidden="true" />
      </button>
      <p className={styles.status} aria-live="polite">
        {status}
      </p>
    </div>
  );
}
