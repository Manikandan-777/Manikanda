# Certificate provider logos

The 3D certificate stack loads each issuer's logo from this folder. Every
certificate in `content/certificates.json` already points at a filename here via
its `logo` field — just drop the matching **official** SVG (or PNG) in.

| Filename | Issuer | Get the official asset from |
|----------|--------|----------------------------|
| `nptel.svg` | NPTEL | nptel.ac.in |
| `google-cloud.svg` | Google Cloud | Google brand resources |
| `microsoft.svg` | Microsoft (four‑square logo) | Microsoft brand & trademark guidelines |
| `juno-school.svg` | Juno School | junolearning.com |
| `reliance-foundation-skilling-academy.svg` | Reliance Foundation Skilling Academy | skillacademy.reliancefoundation.org |
| `digital-marketing-institute.svg` | Digital Marketing Institute | digitalmarketinginstitute.com |
| `university-of-edinburgh.svg` | University of Edinburgh | ed.ac.uk brand toolkit |
| `smarted-innovations.svg` | SmartEd Innovations | provider site |
| `guvi.svg` | GUVI | guvi.in |
| `study-comrade.svg` | Study Comrade | provider site |

Rules:
- Use the provider's own official file — don't redraw, trace, or approximate it.
- Keep its native aspect ratio; the card scales it to `height: 24px`.
- Transparent background preferred (dark cards auto‑invert it to white).

**Until a file is added**, the card falls back on its own — with no broken
image: Google Cloud, Microsoft, Coursera and HCL show a bundled brand mark from
the icon library; anything else shows a short text badge (e.g. `NPTEL`).
