# Dork Watcher - Google Hacking Assistant Tool

English · [日本語](README.md)

![GitHub Repo stars](https://img.shields.io/github/stars/ipusiron/dork-watcher?style=social)
![GitHub forks](https://img.shields.io/github/forks/ipusiron/dork-watcher?style=social)
![GitHub last commit](https://img.shields.io/github/last-commit/ipusiron/dork-watcher)
![GitHub license](https://img.shields.io/github/license/ipusiron/dork-watcher)
[![GitHub Pages](https://img.shields.io/badge/demo-GitHub%20Pages-blue?logo=github)](https://ipusiron.github.io/dork-watcher/)

**Day020 - 100 Security Tools with Generative AI**

**Dork Watcher** builds Google Dork queries for a domain you own, so you can check whether it
leaks anything it should not. It generates 30 queries and lets you narrow them by category, risk
and operator support. Switching between `filetype:` and `ext:` shows, in numbers, how much of
your checking depends on operators Google never documented.

---

## 🌐 Demo

👉 [https://ipusiron.github.io/dork-watcher/](https://ipusiron.github.io/dork-watcher/)

---

## 📸 Screenshots

![Dork list in the light theme](assets/screenshot2.png)
> *30 Dorks generated for example.com*

![Dork list in the dark theme](assets/screenshot3.png)
> *The same 30 rows in the dark theme*

![Eight file-leak Dorks rated High](assets/screenshot4.png)
> *Narrowed to the File leaks category and the High risk level: 8 rows*

![Five documented Dorks in the ext: style](assets/screenshot5.png)
> *In the `ext:` style, "Documented only" leaves the 5 rows written with quotes alone*

---

## 🔍 Google Hacking

**Google Hacking** means using a search engine — usually Google — to find information that was
published by mistake: confidential documents, misconfigured servers, exposed files. It is a
technique attackers use, and it is equally a legitimate part of security assessment and OSINT.

## ❓ What is a Dork?

A **Google Dork** is the search query used for this. It combines search operators such as
`filetype:`, `inurl:` and `intitle:` to find a specific kind of page efficiently.

The name is unkind on purpose.

> "Only a dork would leave this in public."

Johnny Long published the [Google Hacking Database (GHDB)](https://www.exploit-db.com/google-hacking-database)
in 2002 and catalogued thousands of these queries. It is still used in security education,
assessments and CTFs.

Dork Watcher exists for one narrow purpose: **a quick check of a site you administer.**

### 💡 Do Dorks work on other search engines?

Some of the syntax works on DuckDuckGo and Bing, but the index size, the number of hits and the
accuracy all differ, so what you can find differs too.

In August 2025 it was reported that pages created with ChatGPT's share-link feature had been
indexed in bulk by DuckDuckGo. The following Dork was enough to list them.

```
site:chatgpt.com/share
```

> ![Searching DuckDuckGo for ChatGPT share links](assets/ddg_chatgpt_share.png)
>
> *Searching DuckDuckGo for ChatGPT share links*

DuckDuckGo surfaced them sooner, in greater number and for longer — so the privacy-first search
engine became, ironically, the largest source of the leak. Its indexing policy and looser
crawling are the reason.

| Point of comparison | Google | DuckDuckGo |
| --- | --- | --- |
| Dork syntax support | Best (most operators, though only some are documented) | Basic syntax only |
| Index accuracy | Best (largest index) | Weaker (Bing-based) |
| Leak detection | High, but excludes a lot | Medium, removals lag |
| Privacy | Keeps search history | Keeps no search history |

---

## 🧰 Features

- Generates a list of 30 Google Dorks
- Narrows results by category, risk and operator on three independent axes
- One-click search links straight to Google
- Switches the operator style (`filetype:` ⇔ `ext:`)
- Copies the query itself, not the search URL
- Normalises and validates the domain (host extraction from a URL, IDN to punycode)
- Help dialog covering usage and the points to watch
- Japanese and English (`?lang=en`, saved locally, falls back to the browser language)
- Light and dark themes
- Live count of the rows currently shown

---

## 📖 How to use

1. Enter a domain you administer, or one you have permission to investigate.
2. Press **Start Check**, or Enter in the input box, to build the search links.
3. Choose the operator style and the three filters to leave only the queries you want.
4. Open the links one at a time. Use **Copy** on a row to keep the query itself.

If you paste a URL, only its host is used. `https://example.com/path` becomes `example.com`,
and `日本語.jp` becomes `xn--wgv71a119e.jp`. Input containing spaces or search operators, IP
addresses, and malformed domains are rejected. Google's own `site:` accepts a URL prefix, but
this tool keeps every search at domain granularity.

Copying uses the browser's Clipboard API. If the browser or the environment refuses, the page
says so.

## 🌐 Display language

The **JA** button in the top right switches between Japanese and English, and the choice is
saved in localStorage. On a first visit the language comes from `?lang=ja` or `?lang=en`, then
the saved value, then the browser's language setting.

Search operators (`site:`, `filetype:`, `inurl:`, `intitle:`, `intext:`, `ext:`) are proper
names and are never translated. What gets translated is the explanation of each operator and
the wording of the interface. Switching language keeps the generated list, the domain you typed
and every filter selection as they were.

## 🔤 Documented and undocumented operators

"Documented" here means the six operators listed in
[Google's search operator help page](https://support.google.com/websearch/answer/2466433).
They come with an explanation and an example, which also makes changes easier to notice.
Operators outside that list are widely used, but nothing guarantees how they behave today or
that they will keep working.

**When a Dork comes back empty, you need this distinction to tell "the site is clean" from
"the operator stopped working".**

### The operators

| Operator | Status | What it does | Used here |
| --- | --- | --- | --- |
| `site:` | Documented | Restricts to a domain or URL prefix | Prefixed to all 30 |
| `filetype:` | Documented | Restricts to a file format or extension | 12 |
| `""` | Documented | Exact match | 12 |
| `-` | Documented | Excludes a term | Not used |
| `before:` / `after:` | Documented | Restricts by date | Not used |
| `ext:` | Undocumented | Widely used as an alias of `filetype:` | 12 when the style is switched |
| `inurl:` | Undocumented | Term appears in the URL | 9 |
| `intitle:` | Undocumented | Term appears in the title | 5 |
| `intext:` | Undocumented | Term appears in the body | 1 |
| `allintext:` / `allintitle:` / `allinurl:` | Undocumented | Requires every following term; unstable when combined with other operators | Avoided |

Because this tool always prefixes `site:`, it avoids the `allin` family rather than risk that
instability. Administrative terms are written as two operators side by side, as in
`intext:admin intext:login`. A colon inside quotes, as in `"Authorization: Basic"`, does not
count as an operator.

For more on `site:` and `filetype:`, see the
[site: documentation](https://developers.google.com/search/docs/monitor-debug/search-operators/all-search-site)
and the [filetype: notes](https://developers.google.com/search/docs/monitor-debug/search-operators#filetype)
in Search Central. `filetype:` matches the format reported by Content-Type as well as the URL
suffix.

### Checking it yourself

Switching the operator style from `filetype:` to `ext:` gives you both spellings of the same
search intent. The count under "Documented only" drops from 15 to 5. For a domain you are
allowed to test, open both links and see whether the results agree. This tool never fetches
search results and never decides for you whether an operator still works.

| Style | Documented only | Includes undocumented |
| --- | --- | --- |
| `filetype:` (default) | 15 | 15 |
| `ext:` | 5 | 25 |

The 5 that stay documented in the `ext:` style are the ones written with quotes alone:
`"password"`, `"DB_PASSWORD"`, `"Authorization: Basic"`, `"confidential"` and `"private key"`.

### Where the imbalance sits

Not one of the 9 administrative queries can be written with documented operators alone, because
they need `inurl:`, `intitle:` or `intext:`. All 7 information-keyword queries, on the other
hand, are documented in the `filetype:` style. What you are looking for decides which operators
you have to lean on.

| Category | Count | Documented only | Includes undocumented |
| --- | --- | --- | --- |
| File leaks | 10 | 7 | 3 |
| Admin access | 9 | 0 | 9 |
| Info keywords | 7 | 7 | 0 |
| Others | 4 | 1 | 3 |
| Total | 30 | 15 | 15 |

## 🧰 The Dorks included

| Category | Count | High | Medium | Low |
| --- | --- | --- | --- | --- |
| File leaks | 10 | 8 | 1 | 1 |
| Admin access | 9 | 1 | 8 | 0 |
| Info keywords | 7 | 7 | 0 | 0 |
| Others | 4 | 2 | 1 | 1 |
| Total | 30 | 18 | 10 | 2 |

In the default `filetype:` style, 15 Dorks use documented operators only and 15 include an
undocumented one. The latter carry an **Undocumented** label on screen. Change the style and
both the labels and the filter counts follow the resulting queries.

## 🔧 Filters

### 📂 Category

- **File leaks** — whether files such as `.env` or `.sql` became public by mistake
- **Admin access** — exposed login pages and admin panels
- **Info keywords** — pages that may carry passwords, API keys or other internal detail
- **Others** — directory listings, leftover test pages

### ⚠️ Risk level

- **High** — could lead directly to a leak of confidential information
- **Medium** — worth a security look
- **Low** — ordinary information, still worth checking

### 🔤 Operator

"All", "Documented only" and "Includes undocumented". This is not a fixed attribute of each
Dork: it is decided from the query after the operator style has been applied.

### 🔁 Combining them

The three axes are combined with AND, so "File leaks" and "High" and "Documented only" narrow
together, and the order you pick them in makes no difference. Some combinations come back
empty. The `ext:` style with "Documented only" and "File leaks" gives 0 rows, and that is
correct behaviour.

---

## 🧯 What to do after a hit

1. **Stop the exposure first.** Take the file or page out of the public area. If you cannot do
   that immediately, put authentication or an IP restriction in front of it.
2. **Assume it leaked.** If a password, API key, token or private key was in there, revoke it
   and issue a new one. Deleting the file is not enough.
3. **Get it out of the search results.** Hide the URL temporarily with the Removals tool in
   Search Console, and return 404 or 410 for URLs you have taken down for good.
4. **Fix the cause.** Review your deployment steps, where backups are written, and your
   directory listing settings, so it does not happen again.

Anything a search engine held was, by definition, reachable by a third party. Reissuing
credentials comes before tidying up.

Google's [Removals and SafeSearch reports tool](https://support.google.com/webmasters/answer/9689846)
blocks a URL for about six months. Permanent removal needs something on your side as well:
take the content down and return 404 or 410. Restricting access behind authentication also
works, but **do not use robots.txt as a way to hide things.** Anyone can read robots.txt, so
listing a path there announces it.

| Category | Common cause | What to do |
| --- | --- | --- |
| File leaks | A backup or config file left in a public directory | Remove the file → reissue the credentials → review where files are written and how you deploy |
| Admin access | The admin URL is in the search index | Being listed is not itself a vulnerability. Consider IP restrictions, extra or multi-factor authentication, and `noindex` |
| Info keywords | Sensitive terms in the body text | Work out whether it is noise from an article or a real credential. If it is real, reissue it |
| Others | Listing left on, a stray `phpinfo()` or test page | `Options -Indexes` on Apache, `autoindex off` on nginx. Delete pages you do not need |

## ⚠️ Before you use this

This tool exists to help you **check whether information was published unintentionally.** Keep
the following in mind.

- 🔍 **In most cases nothing comes back, and that is normal.** On a site that takes security
  seriously, files and details that could leak are not reachable. Google also restricts or
  excludes results of its own accord:

  - pages excluded by `noindex` (robots.txt alone does not guarantee removal from results)
  - direct links to unintended sensitive files such as `.git`, `.env` and `passwd`
  - index removals based on reports or automatic detection

- 🔁 **Google's behaviour changes.** Dorks that once worked, such as `intitle:"index of"` or
  `inurl:admin`, may now find little. Repeating complex or automated queries can also get you
  flagged as a bot and rate-limited for a while.

- 📄 **Common keywords such as "password" are mostly noise.** The hits are usually articles,
  manuals and security write-ups rather than an actual leaked password.

- 🛡 **Finding nothing does not prove you are safe.** Leaked information may sit somewhere
  Google never indexed — behind authentication, or in an area blocked from crawlers.

- 🧪 **This is a quick check, nothing more.** It does not replace a thorough vulnerability
  assessment or a penetration test. For a serious investigation, use a professional assessment
  service or a dedicated OSINT tool.

- 🧭 **Investigate only domains you administer, or sites you have permission to test.**
  Collecting information about someone else's site, or running Dork searches against it, can
  constitute unauthorised access or a privacy violation.

---

## 🎯 Use cases

### Ways of using this tool in particular

- Confirming that you scope the check to your own domain (self-check and OSINT classes): `site:` limits the search to your own domain. Combining `example.com` with the file-search `filetype:xls` makes the query `site:example.com filetype:xls`. You can confirm the idea of narrowing an exhaustive search to your own property and checking whether spreadsheets that should not be public can be found from outside
- Confirming the difference between an official operator and an unofficial alias (search-operator classes): `filetype:` is Google's official operator, while `ext:` means the same but is unofficial. `filetype:pdf` is judged official and `ext:pdf` unofficial. Rewriting it as `ext:` gives much the same result, and you can confirm it is a choice between the official and unofficial spelling
- Confirming that the input domain is normalized (input-processing classes): entering `https://Example.COM/path?q=1` drops the scheme, upper case, path and query and normalizes it to `example.com`. Input containing whitespace is rejected as not a valid domain. You can confirm the idea of normalizing input into a fixed form before using it in a search

### General uses

- Check whether your own or your company's site exposes files or pages unintentionally
- Use it as material to learn how to use Google search operators (`site:`, `filetype:` and so on)
- Explain how information gathering from search engines (OSINT) works in security training

## 🔒 Security

The domain is parsed as a URL, and the host name, label lengths and TLD format are all checked.
Input mixing in search operators or spaces is rejected, and any note derived from your input is
written with `textContent`. Scripts, styles and the icon are bundled, so loading the page and
building queries cause no outbound traffic. When you open a search link yourself, the query is
sent to Google.

The CSP includes `script-src 'self'`, `style-src 'self'` and `connect-src 'none'`, which rules
out inline scripts and outbound requests. The referrer policy is `no-referrer`, and links that
open in a new tab carry `rel="noopener noreferrer"`. `frame-ancestors` has no effect from a
meta tag, so embedding is not prevented.

The only things kept in localStorage are the theme (`theme`), the display language
(`dork-watcher-language`) and the operator style (`operatorStyle`). Where storage is blocked,
the page still works for the rest of the session.

## 🧪 Tests

Node 22 or later, with no packages to install.

```sh
npm test
```

The suite covers 24 domain-normalisation cases, the 30 queries, every filter count, the colour
contrasts, the HTML, the Japanese and English dictionaries, and the tables, images and full
file list in the README. GitHub Actions runs the same suite on every push and pull request.

## 📁 Directory structure

```text
dork-watcher/
├── .github/workflows/test.yml    # Runs npm test on push and pull request
├── .gitignore
├── .nojekyll                     # Disables Jekyll processing on Pages
├── assets/                       # README images and the site icon
├── CLAUDE.md                     # Development guide for AI assistants
├── domain.js                     # Domain normalisation and validation
├── dorks.js                      # The 30 Dork definitions
├── i18n.js                       # Japanese and English wording, and applying it
├── index.html                    # Page markup
├── LICENSE                       # MIT licence
├── package.json                  # npm test, no dependencies
├── query.js                      # Query building and filtering
├── README.en.md                  # This document
├── README.md                     # Japanese documentation
├── script.js                     # Page assembly and event handling
├── style.css                     # Colour variables and responsive layout
└── test/                         # node --test suite
    ├── contrast.test.js          # Text and surface contrast
    ├── domain.test.js            # Domain normalisation expectations
    ├── dorks.test.js             # Dork definitions: counts, duplicates, banned patterns
    ├── format.test.js            # Line length and readability
    ├── html.test.js              # CSP, ARIA and inline attributes
    ├── i18n.test.js              # The two dictionaries and the data-i18n wiring
    ├── query.test.js             # Query building, filter counts, operator classification
    ├── readme.test.js            # Tables, images, tree and YAML
    └── static.test.js            # Purity, no logging, CI configuration
```

## 💻 Requirements

A current JavaScript-capable browser: Chrome, Edge, Firefox and the like. This revision was
verified on Chromium over HTTP and as `file://`. Opening a downloaded `index.html` directly
still lets you build queries and use the filters. Copying depends on the browser's Clipboard
API permissions.

To serve it over local HTTP, run the following where Python is available and open
`http://127.0.0.1:8000/`.

```sh
python -m http.server 8000 --bind 127.0.0.1
```

## 📄 Licence

MIT License - see [LICENSE](LICENSE) for details.

---

## 🛠️ About this tool

This tool was built as part of **100 Security Tools with Generative AI**, a project that
creates and publishes a security-related tool every day for 100 days with the help of
generative AI.

🔗 [https://akademeia.info/?page_id=42163](https://akademeia.info/?page_id=42163)
