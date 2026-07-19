# Public Account Entry Design

Public visitors must always be able to find the application doorway. Desktop navigation shows a restrained secondary **Sign in** action and primary **Get started** action beside locale/theme controls. The mobile menu includes both as full-width destinations. The landing hero makes account creation primary and sign-in secondary while retaining public feature exploration as a text link. The footer adds an Account group with the same two destinations.

English remains primary and Macedonian receives matching copy. Existing public information architecture and Sage Dusk styling remain unchanged. Authentication destinations are `/sign-in` and `/sign-up`; no dashboard alias is introduced. Authenticated logo routing continues through the existing session-aware Brand component.

Acceptance requires visible account entry at header, mobile menu, hero, and footer; 44px targets; safe 320px wrapping; keyboard focus; no duplicate inaccessible navigation landmarks; and passing contract, type, lint, and production-build gates.
