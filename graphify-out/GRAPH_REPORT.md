# Graph Report - zack-electric-workspace  (2026-10-25)

## Corpus Check
- 26 files · ~17,148 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: .css 8, .example 1, (none) 1)

## Summary
- 197 nodes · 317 edges · 20 communities (16 shown, 4 thin omitted)
- Extraction: 92% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `24ea8cf8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App Workflow & Utilities
- Lint & Build Tooling
- Document Preview System
- Runtime Dependencies & Auth
- Project Technology Stack
- Source Directory Architecture
- Vite Brand Asset
- Items & Payment Forms
- Social Icon Sprite
- Zack Electric Brand
- Signature Asset
- Graphify Workflow
- Hero Illustration
- Favicon Brand Identity
- React Brand Asset
- Logo Asset
- React Plugin Tooling
- SWC Plugin Tooling
- TypeScript Tooling
- Vercel Deployment

## God Nodes (most connected - your core abstractions)
1. `App()` - 12 edges
2. `lucide-react` - 9 edges
3. `react` - 9 edges
4. `getCustomerDatabase()` - 9 edges
5. `formatDateIndonesia()` - 8 edges
6. `LivePreviewDrawer()` - 7 edges
7. `formatRupiah()` - 7 edges
8. `generateFullInvoiceNumber()` - 7 edges
9. `node_modules` - 7 edges
10. `src Directory` - 7 edges

## Surprising Connections (you probably didn't know these)
- `HTML Application Entry Document` --conceptually_related_to--> `React and Vite Template`  [INFERRED]
  index.html → README.md
- `App()` --calls--> `CustomerModal()`  [EXTRACTED]
  src/App.jsx → src/components/modals/CustomerModal.jsx
- `App()` --calls--> `LivePreviewDrawer()`  [EXTRACTED]
  src/App.jsx → src/components/preview/LivePreviewDrawer.jsx
- `CustomerModalContent()` --calls--> `getCustomerDatabase()`  [EXTRACTED]
  src/components/modals/CustomerModal.jsx → src/utils/customerDb.js
- `ESLint` --conceptually_related_to--> `ESLint Packages`  [INFERRED]
  README.md → tree.txt

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Reusable icon symbol collection** — public_icons_svg_sprite, public_icons_bluesky_icon, public_icons_discord_icon, public_icons_documentation_icon, public_icons_github_icon, public_icons_social_icon, public_icons_x_icon [EXTRACTED 1.00]
- **Signature composition from cursive marks and flourishes** — src_assets_ttd_cursive_name, src_assets_ttd_upper_flourish, src_assets_ttd_horizontal_strokes, src_assets_ttd_diagonal_stroke [EXTRACTED 1.00]
- **Favicon visual composition** — public_favicon_svg_asset, public_favicon_lightning_bolt_symbol, public_favicon_purple_blue_palette, public_favicon_masked_glow_texture, public_favicon_electric_brand_identity [INFERRED 0.85]
- **Vite Logo Composition** — src_assets_vite_lightning_bolt, src_assets_vite_parenthesis_frame, src_assets_vite_luminous_gradient_effect, src_assets_vite_vite_logo [INFERRED 0.85]
- **React Logo Composition** — src_assets_react_react_logo, src_assets_react_atom_like_orbital_motif, src_assets_react_central_nucleus, src_assets_react_cyan_color [INFERRED 0.95]

## Communities (20 total, 4 thin omitted)

### Community 0 - "App Workflow & Utilities"
Cohesion: 0.17
Nodes (19): lucide-react, App(), LoginModal(), Step1Metadata(), CATEGORY_SECTIONS, normalizeCategory(), Step2Items(), Step3Payment() (+11 more)

### Community 1 - "Lint & Build Tooling"
Cohesion: 0.09
Nodes (28): devDependencies, eslint@^10.10.0, @eslint/js@^10.0.1, eslint-plugin-react-hooks@^7.1.1, eslint-plugin-react-refresh@^0.5.6, globals@^17.12.0, @types/react@^19.2.18, @types/react-dom@^19.2.7 (+20 more)

### Community 2 - "Document Preview System"
Cohesion: 0.27
Nodes (9): InvoiceA4(), KwitansiA4(), LivePreviewDrawer(), PAPER_HEIGHT_MM, PaperScale(), QuotationA4(), formatDateIndonesia(), formatRupiah() (+1 more)

### Community 3 - "Runtime Dependencies & Auth"
Cohesion: 0.16
Nodes (12): favicon.svg, HTML Application Entry Document, Root Application Mount, zack-electric-workspace, dependencies, lucide-react@^1.55.0, react@^19.2.8, react-dom@^19.2.8 (+4 more)

### Community 4 - "Project Technology Stack"
Cohesion: 0.18
Nodes (13): ESLint, Hot Module Replacement, React, React Compiler, React and Vite Template, Vite, ESLint Packages, Lucide React (+5 more)

### Community 5 - "Source Directory Architecture"
Cohesion: 0.17
Nodes (12): Authentication Components, Form Components, Preview Components, Project Directory Structure, public Directory, src/assets, src/components, src/config (+4 more)

### Community 6 - "Vite Brand Asset"
Cohesion: 0.22
Nodes (9): Accessible Vite Title, Blurred Ellipse Layers, Bolt-Shaped Mask, Cyan Highlights, Dark Mode Adaptation, Purple Lightning Bolt, Luminous Gradient Effect, Parenthesis Frame (+1 more)

### Community 7 - "Items & Payment Forms"
Cohesion: 0.14
Nodes (15): btnIconStyle, btnPrimaryStyle, btnSecondaryStyle, btnUseStyle, closeBtnStyle, CustomerModal(), CustomerModalContent(), customerRowStyle (+7 more)

### Community 8 - "Social Icon Sprite"
Cohesion: 0.29
Nodes (7): Bluesky icon, Discord icon, Documentation icon, GitHub icon, Social icon, Social and navigation icon sprite, X icon

### Community 9 - "Zack Electric Brand"
Cohesion: 0.48
Nodes (6): Circular badge emblem, Electrical services business, JAKARTA, Zack Electric logo, ZACK ELECTRIC, ZE monogram

### Community 10 - "Signature Asset"
Cohesion: 0.29
Nodes (7): Ambiguous cursive name or initials, Long descending diagonal stroke, Extended horizontal crossing and underline strokes, PNG image containing a handwritten signature, Monochrome thin-line calligraphic style, Stylized handwritten signature, Large looping upper flourish

### Community 11 - "Graphify Workflow"
Cohesion: 0.33
Nodes (6): graphify explain, Graphify Project Instructions, graphify path, graphify query, graphify update, Project Knowledge Graph

### Community 12 - "Hero Illustration"
Cohesion: 0.67
Nodes (6): Hero illustration, Layered system architecture, Lower floating rounded rectangular layer, Purple luminous edge treatment, Upper floating rounded rectangular layer, Vertical dashed connectors between layers

### Community 13 - "Favicon Brand Identity"
Cohesion: 0.60
Nodes (5): Electric brand identity suggested by lightning imagery and an energetic neon palette., Lightning bolt symbol represented by the angular zigzag silhouette., Masked glow texture formed by blurred transformed ellipses clipped inside the main silhouette., Purple, blue, and pale-lavender palette using #863bff, #7e14ff, #47bfff, and #ede6ff., Favicon SVG asset: a 48 by 46 SVG image with a dominant angular silhouette and layered clipped color effects.

### Community 14 - "React Brand Asset"
Cohesion: 0.50
Nodes (4): Atom-Like Orbital Motif, Central Nucleus, React Cyan (#00D8FF), React Logo

### Community 15 - "Logo Asset"
Cohesion: 1.00
Nodes (3): Blue gradient color treatment, Logo image, Stylized ZE lettermark

## Ambiguous Edges - Review These
- `Ambiguous cursive name or initials` → `Stylized handwritten signature`  [AMBIGUOUS]
  src/assets/ttd.png · relation: represents

## Knowledge Gaps
- **47 isolated node(s):** `Ambiguous cursive name or initials`, `Long descending diagonal stroke`, `Extended horizontal crossing and underline strokes`, `Monochrome thin-line calligraphic style`, `Large looping upper flourish` (+42 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 76 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Runtime Dependencies & Auth` to `App Workflow & Utilities`, `Lint & Build Tooling`, `Document Preview System`, `Items & Payment Forms`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._
- **What connects `Ambiguous cursive name or initials`, `Long descending diagonal stroke`, `Extended horizontal crossing and underline strokes` to the rest of the system?**
  _47 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Lint & Build Tooling` be split into smaller, more focused modules?**
  _Cohesion score 0.09462365591397849 - nodes in this community are weakly interconnected._
- **Why does `src Directory` connect `Source Directory Architecture` to `Runtime Dependencies & Auth`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **Should `Items & Payment Forms` be split into smaller, more focused modules?**
  _Cohesion score 0.14166666666666666 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `App Workflow & Utilities` to `Lint & Build Tooling`, `Document Preview System`, `Runtime Dependencies & Auth`, `Items & Payment Forms`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Ambiguous cursive name or initials` and `Stylized handwritten signature`?**
  _Edge tagged AMBIGUOUS (relation: represents) - confidence is low._