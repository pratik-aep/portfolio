# Content the owner must supply

Everything below is either hidden or shown as a clearly labelled placeholder until it is provided. Nothing here should be invented. Search the code for `TODO(owner)` to find the related spots.

## Site configuration (Phase 1)

Set these as repository variables (Settings → Secrets and variables → Actions → Variables) or in `.env.local`. See `.env.example` for details.

| Variable                                            | What to provide                                                                                | Until then                                                  |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `NEXT_PUBLIC_FORM_ENDPOINT`                         | A Formspree form URL, or `https://api.web3forms.com/submit` plus `NEXT_PUBLIC_FORM_ACCESS_KEY` | The form opens an email draft, or saves the brief as a file |
| `NEXT_PUBLIC_CONTACT_EMAIL`                         | A monitored contact address                                                                    | No email link; no fallback if the form service fails        |
| `NEXT_PUBLIC_BOOKING_URL`                           | Cal.com or Calendly link                                                                       | "Book a call" hidden                                        |
| `NEXT_PUBLIC_RESUME_URL`                            | A PDF URL, or put `resume.pdf` in `public/` and use `/resume.pdf`                              | "Download résumé" hidden                                    |
| `NEXT_PUBLIC_GITHUB_URL`, `_LINKEDIN_URL`, `_X_URL` | Profile URLs                                                                                   | Icons hidden                                                |
| `NEXT_PUBLIC_SITE_URL`                              | Only if the site moves to a custom domain                                                      | Defaults to `https://pratik-aep.github.io/portfolio`        |

## Projects (`data/projects.ts`)

For each of Lake Monitoring System, Antarctic Route Planner, NASA Exoplanet Classifier and 3D Medical Simulation:

- [ ] Real screenshots or a short screen recording. The current previews are illustrative SVGs labelled "Concept preview".
- [ ] Confirmation that the listed tags (technologies) are accurate.
- [ ] Confirmation that the one-line descriptions are accurate.

## Contact page (`data/site.ts`)

Plain fields in `data/site.ts` (not env vars). Each piece of UI stays hidden while its field is empty.

- [ ] `availability`: short note for the badge with the live dot, e.g. "Taking new projects from November".
- [ ] `city` and `timeZone` (IANA name, e.g. `Asia/Kolkata`): together they show "Based in {city} · {local time} here". Both are required.
- [ ] `budgetRanges` and `currency`: budget choices for the form, in your own words (used from Phase B).
- [ ] `timelines`: timeline choices for the form (used from Phase B).
- [ ] `faq`: real questions and answers (used from Phase C).
