# Hand Deck online integration contract

The current build remains a browser-local prototype. These are the server behaviors needed before the same features can connect real players on different devices. Client-side checks and local profile IDs are not authentication or authorization.

## Identity and migration

- Authenticate a real user, then let them claim/import each local player profile deliberately. Keep a stable server player ID and map the local ID to it; never assume that possession of a localStorage ID proves ownership.
- Server-owned records: profiles, decks, follows, posts, comments, likes, matches, badge awards, and media. Hand Deck copies existing TOMEO browser data once into `handdeck-*` keys, then keeps the two previews independent.
- Reads and writes must check the authenticated account on the server. Social visibility must be enforced by the API, including requests made directly without the UI.

## Decks

- `visibility` is `private` by default and can become `public` only through its owner. Existing decks without the field remain private.
- Public profile responses include only public deck summaries; a public deck detail endpoint returns its card list and appearance to other players. Private deck detail and all edit/delete operations require owner authorization.
- Keep a stable deck ID when Studio saves an existing deck. Apply visibility and appearance to that ID, including after a rename or edit.
- A Match may reference an owned `deckId`. Resolve that ID through the same deck permission check as Deck Preview: the owner sees their Private deck, while other players receive no private name, cover, cards, or link. A deleted deck leaves the Match record intact with an unavailable-deck label.

## Follows and posts

- `PUT /api/players/{playerId}/follow` and `DELETE /api/players/{playerId}/follow` are idempotent authenticated actions. Reject self-follow and non-existent targets; return current `following` state and counts. Search must query server profiles, not localStorage.
- `GET /api/feed` returns the user's own posts plus authorized followed players' posts. `GET /api/posts/{postId}` and media URLs enforce the same rule. Decide whether Follow is immediate or requires approval before promising private followers-only posts.
- Likes and comments need server ownership, uniqueness for each liker/post pair, rate limits, and safe content handling. Upload images to protected object storage rather than keeping base64 in a whole-post browser record.

## Notifications

- The current bell reads `handdeck-player-notifications-v1` in this browser only. Online delivery needs server-owned notification records with stable IDs, recipient ID, actor ID, event type, target ID, creation time, and read time. The client must never choose another recipient or forge an actor in the server API.
- Create notifications after successful Follow, Like, Comment, Match request/response, and Badge transactions. Do not notify for self-reactions or an unlike. Deduplicate event retries, enforce target visibility when opening a notification, and remove or redact references after a post or player is deleted.
- `GET /api/notifications` returns only the authenticated recipient's items and unread count. Mark-read endpoints must verify that same recipient. Push or live updates can be added later; polling is enough for the first online beta.

## Match verification and permanent badges

- A Match has one stable ID, `ownerId`, optional `opponentId`, game, both scores, result from the owner's perspective, and `verification` (`unverified`, `pending`, `verified`, or `declined`). Untagged matches are unverified; tagging a real player creates a pending request.
- Only the tagged opponent can accept or decline. Verify/decline operations must be idempotent and atomic with the Match, post label, both players' derived stats, and any badge awards. A verified match counts once for each player with inverse result and scores. An unverified or declined match counts only for its recorder.
- Badge awards are permanent historical milestones. Deleting a Match changes match stats but does not revoke an already awarded badge. UI should state this rule. The server should record the award event once per player/badge, not recalculate it away from the current Match list.
- Define game-specific scoring, draws/forfeits, and dispute/correction rules before using stats for rankings or tournaments.

## Instagram Story publishing boundary

- The Player Platform now sends all ordinary Story shares through `story-share.js`. It retains the native device share/download flow for players.
- A future server can enable the optional **Publish to Instagram Story** button by setting `window.HANDDECK_STORY_API = { enabled: true, endpoint: '/api/stories/publish' }` before the deferred app scripts load. With no configuration, the button is absent and no publishing request is sent.
- On a user's explicit click, the client sends a same-origin authenticated `multipart/form-data` POST with `image` (1080 × 1920 PNG), `kind` (`profile`, `badge`, `deck`, or `post`) and `sourceId`. The endpoint must verify that the user owns or may share the source, validate the image, convert it if required, and return JSON `{ "status": "published" }` only after the remote publish succeeds. Keep Meta tokens, account mapping, upload/publish steps, and retry logic on the server; never expose tokens in browser code.
- [Meta's Instagram API collection](https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api?entity=request-23987686-6fa9ed1d-3310-4844-ad25-f0001ab66f11) says its Facebook Login publishing flow does not access personal consumer accounts and that Story publishing is available only to eligible business accounts. Verify current Meta eligibility and app permissions during backend implementation. For ordinary personal accounts, the device share sheet remains the intended path; it lets the person finish the Story in Instagram.

## Acceptance test before online beta

Use two real accounts on two separate phones. A creates a private deck (B cannot read it), then makes it public (B can view but not edit). A posts a Match tagging B; B accepts one and declines another. Both profiles show reciprocal stats only for the accepted Match. Both retain earned badges after a Match is later removed. A and B follow, react, and comment across devices; direct API requests without authorization fail. Story sharing uses the device share sheet for personal accounts and calls the server endpoint only for a connected eligible account after an explicit click.
