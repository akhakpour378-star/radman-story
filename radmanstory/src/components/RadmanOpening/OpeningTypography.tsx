"use client";

import "./OpeningTypography.css";

export default function OpeningTypography() {
  return (
    <>
      <div className="opening__copy">
        <div className="opening-copy__eyebrow">
          <span />
          A MEMORY IN THE FOREST
        </div>

        <h1>
          <span>For</span>
          <span>Radman.</span>
        </h1>

        <p>
          Some stories are not meant
          <br />
          to end.
        </p>
      </div>

      <div className="opening__ui">
        <div className="opening-ui__top">
          <span className="opening-ui__mark">R</span>

          <span className="opening-ui__brand">
            RADMAN
          </span>

          <span className="opening-ui__chapter">
            MEMORY / 01
          </span>
        </div>

        <div className="opening-ui__bottom">
          <span>35°41′ N</span>

          <div className="opening-ui__scroll">
            <span>SCROLL TO ENTER</span>
            <i />
          </div>

          <span>MMXXVI</span>
        </div>
      </div>
    </>
  );
}