# Hand Deck Player Platform

Public static preview of the Hand Deck TCG player platform and Disney Lorcana Deck Studio.

**Open the site:** [Hand Deck Player Platform](https://manmercy.github.io/handdeck-player-platform/)

**Try two test profiles:** [Open the Hand Deck test drive](https://manmercy.github.io/handdeck-player-platform/test-drive.html). This is optional and adds Aria and Ken only to the browser where you click the button. It includes two public 60-card decks, two Moments, two verified Matches, reciprocal follows, likes, and comments. Use the account menu to switch between them.

## What works in this preview

- Create and switch between player profiles on one browser.
- Build and save Lorcana decks, choose a cover theme or upload an image, and set each deck to Private or Public. Public decks appear on other local players' profiles and open in a read-only Preview.
- Record a Match or post a Moment. Match posts can link one of your Lorcana decks and show a score graphic; linked Private decks remain hidden from other players. Follow another local player to see their posts, then like and comment.
- Tag a local opponent in a Match. Their acceptance adds a Verified mark and reciprocal stats; a declined or unanswered Match counts only for the recorder. Earned badges remain after Match posts are removed.
- Open the activity bell for local Follow, Like, Comment, Match response, and Badge notifications. The unread count and read state belong to each local profile.
- A Match request notification opens the rival's verification card even when the rival does not follow the recorder. After verification, it opens the Match in the rival's profile history. Match History shows the linked deck when the viewer may access it, and opens the original post from the recorder's own history.
- Download or share profile, deck, badge, and post Story graphics with the device share sheet.

All profiles, decks, posts, and reactions are stored in that visitor's browser. **Public URL does not mean shared accounts:** players on different devices cannot find or follow each other yet. Google sign-in, cloud storage, cross-device Match verification, shop/event accounts, and direct Instagram publishing require a backend. The intended server contract is in [ONLINE_INTEGRATION.md](ONLINE_INTEGRATION.md).

On first visit, Hand Deck copies existing TOMEO browser records into its own storage keys. The original TOMEO preview remains separate after that copy; changes in one preview do not update the other.

## Run locally

From this repository's root, run `python3 -m http.server 8000`, then open `http://localhost:8000/`. Keep the Player Platform and Studio under the same origin so they share the same local deck library.

## Deployment

GitHub Pages publishes the `main` branch from the repository root. The root `index.html` forwards visitors to `Handdeck-Player-Platform/index.html`; the Lorcana Studio files live in `Lorecana-Card-Data/dist/`. `.nojekyll` preserves the static assets. No build step or server environment variables are used in this preview.

Disney Lorcana card images, artwork, characters, trademarks, and related intellectual property belong to their respective rights holders. Hand Deck is an independent community preview and is not affiliated with or endorsed by Disney or Ravensburger. Card metadata is attributed to [LorcanaJSON](https://lorcanajson.org/).
