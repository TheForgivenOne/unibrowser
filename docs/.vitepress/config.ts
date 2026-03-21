import { defineConfig } from "vitepress";

export default defineConfig({
  title: "unibrowser",
  description:
    "Write one test. Run it across Chrome, Firefox, and Safari. Headless cross-browser E2E testing with full type safety.",
  base: "/unibrowser/",

  head: [
    ["meta", { name: "theme-color", content: "#646cff" }],
    ["meta", { property: "og:title", content: "unibrowser" }],
    [
      "meta",
      {
        property: "og:description",
        content:
          "Headless cross-browser E2E testing for TypeScript. One test, three browsers.",
      },
    ],
    [
      "script",
      {
        src: "https://context7.com/widget.js",
        "data-library": "/theforgivenone/unibrowser",
        defer: "",
      },
    ],
  ],

  themeConfig: {
    logo: "/logo.svg",
    siteTitle: "unibrowser",

    nav: [
      { text: "Guide", link: "/getting-started" },
      { text: "API", link: "/api/unibrowser" },
      {
        text: "v0.1.0",
        items: [
          {
            text: "Changelog",
            link: "https://github.com/TheForgivenOne/unibrowser/releases",
          },
          {
            text: "NPM",
            link: "https://www.npmjs.com/package/unibrowser",
          },
        ],
      },
    ],

    sidebar: {
      "/": [
        {
          text: "Introduction",
          items: [
            { text: "What is unibrowser?", link: "/" },
            { text: "Getting Started", link: "/getting-started" },
          ],
        },
        {
          text: "API",
          collapsed: false,
          items: [
            { text: "UniBrowser", link: "/api/unibrowser" },
            { text: "UniPage", link: "/api/page" },
            { text: "UniElement", link: "/api/element" },
            { text: "UniContext", link: "/api/context" },
            { text: "Browser Manager", link: "/api/manager" },
          ],
        },
        {
          text: "Guides",
          collapsed: false,
          items: [
            { text: "Cross-Browser Testing", link: "/guides/cross-browser" },
            { text: "Assertions", link: "/guides/assertions" },
            { text: "Screenshots", link: "/guides/screenshots" },
            { text: "Network", link: "/guides/network" },
            { text: "CI/CD", link: "/guides/ci-cd" },
          ],
        },
        {
          text: "Reference",
          collapsed: false,
          items: [
            { text: "Types", link: "/reference/types" },
            { text: "Configuration", link: "/reference/config" },
            { text: "Utilities", link: "/reference/utils" },
            { text: "Pyright", link: "/pyright" },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/TheForgivenOne/unibrowser" },
      { icon: "npm", link: "https://www.npmjs.com/package/unibrowser" },
    ],

    search: {
      provider: "local",
    },

    editLink: {
      pattern:
        "https://github.com/TheForgivenOne/unibrowser/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },

    footer: {
      message: "Released under the Apache 2.0 License.",
      copyright: "Copyright 2024-present unibrowser contributors",
    },
  },
});
