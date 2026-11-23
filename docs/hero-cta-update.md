# TREAN AI Hero CTA Update

## Change
The landing-page hero no longer displays the PWA `Install now` button. It is replaced by `Explore workspace`.

## Behavior
- **Get started** continues to navigate to the Create Account screen.
- **Explore workspace** navigates directly to the Chat workspace.
- The existing secondary button style is retained.
- The PWA installation button component is not used in the hero.

## Source
File: `app/page.tsx`

```tsx
<div className="hero-buttons">
  <Button kind="primary" onClick={() => go("Create Account")}>
    Get started <ArrowUp />
  </Button>

  <Button kind="secondary" onClick={() => go("Chat")}>
    Explore workspace <PanelLeft />
  </Button>
</div>
```

## Dependencies
- `Button`: existing reusable button component.
- `go`: existing page navigation function.
- `PanelLeft`: Lucide icon already imported by the page.

## Deploy
The change is committed to branch `fix/trean-pwa-install-hero`. Vercel production deployment was initiated.

Production URL: https://trean-ai.vercel.app/

## Verification
1. Open the landing page on mobile or desktop.
2. Confirm the hero CTA reads **Explore workspace**.
3. Tap it.
4. Confirm the app opens the Chat workspace.
5. Confirm **Get started** still opens account creation.
