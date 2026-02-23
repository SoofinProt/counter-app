/**
 * Copyright 2026 SoofinProt
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `counter-app`
 * 
 * @demo index.html
 * @element counter-app
 */
export class CounterApp extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "counter-app";
  }

  constructor() {
    super();
    this.title = "";
    this.counter = 10;
    this.min = 10;
    this.max = 25;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Title",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/counter-app.ar.json", import.meta.url).href +
        "/../",
    });
  }

  /* Lit reactive properties */
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      counter: { type: Number, reflect: true },
      min: { type: Number },
      max: { type: Number },    
    };
  }

  /* Lit scoped styles */
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: inline-block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-default-skyLight);
        font-family: var(--ddd-font-navigation);
        min-width: 224px;

      }
      .wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
        min-height: 128px;
      }
      h3 span {
        font-size: var(--counter-app-label-font-size, var(--ddd-font-size-s));
      }

      /* Large font size for the counter number */
        .counter-number {
          font-size: 30px;
          font-weight: var(--ddd-font-weight-bold);
          margin-bottom: var(--ddd-spacing-4);
          transition: color 0.3s ease;
        }

        .button-container {
          display: flex;
          gap: var(--ddd-spacing-4);
        }

        button {
          padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
          font-size: var(--ddd-font-size-m);
          cursor: pointer;
          border: var(--ddd-border-sm);
          border-color: var(--ddd-theme-default-beaverBlue);
          border-radius: var(--ddd-radius-xs);
          background-color: var(--ddd-theme-default-limestoneGray);
          min-width: 56px;
        }

        /* Hover and Focus changes */
        button:hover:not(:disabled) {
          background-color: var(--ddd-theme-default-nittanyNavy);
          color: white;
        }

        button:focus {
          outline: 2px solid var(--ddd-theme-default-pennBlue);
        }

        button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        /* Changes color bases on counter */
        .counter-number.at-min-max { 
          color: var(--ddd-theme-default-original87Pink); 
        }
        .at-18 { 
          color: var(--ddd-theme-default-wonderPurple); 
        }
        .at-21 { 
          color: var(--ddd-theme-default-inventOrange); 
        }

        /* Style for the slot */
        ::slotted(div) {
          color: var(---ddd-theme-default-beaverBlue);
          font-size: var(--ddd-font-size-xs);
          margin-top: var(--ddd-spacing-2);
        }
      `,
    ];
  }

  
  /* Helps determine the class for the counter number color based on value */
  _getCounterClass() {
    if (this.counter === this.min || this.counter === this.max) return "at-min-max";
    if (this.counter === 18) return "at-18";
    if (this.counter === 21) return "at-21";
    return "";
  }

  /* Increments the counter and enforces the maximum limit */
  increment() {
    if (this.counter < this.max) {
      this.counter++;
    }
  }

  /* Decrements the counter and enforces the minimum limit */
  decrement() {
    if (this.counter > this.min) {
      this.counter--;
    }
  }

  
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has('counter')) {
      if (this.counter === 21) {
        this.makeItRain();
      }
    }
  }

  /* Imports of confetti-container and does animation */
  makeItRain() {
    import("@haxtheweb/multiple-choice/lib/confetti-container.js").then(
      (module) => {
        setTimeout(() => {
          // Select the confetti container in our shadowRoot and trigger it
          this.shadowRoot.querySelector("#confetti").setAttribute("popped", "");
        }, 0);
      }
    );
  }

  /* Lit render the HTML */
  render() {
    return html`
      <confetti-container id="confetti">
        <div class="wrapper">
          <div class="counter-number ${this._getCounterClass()}">${this.counter}</div>
          <div class="button-container">
            <button @click="${this.decrement}" ?disabled="${this.counter === this.min}">-</button>
            <button @click="${this.increment}" ?disabled="${this.counter === this.max}">+</button>
          </div>
          <slot></slot>
        </div>
      </confetti-container>
    `;
  }

  /* haxProperties integration via file reference */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(CounterApp.tag, CounterApp);