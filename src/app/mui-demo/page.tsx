/**
 * MUI Demo Page
 *
 * This page demonstrates how to use the MUI wrapper components
 * in a server component without needing 'use client'.
 */

import {
  MuiButton,
  MuiCard,
  MuiCardContent,
  MuiCardActions,
  MuiTypography,
  MuiStack,
  MuiBox,
  MuiChip,
  MuiAlert,
  MuiTextField,
} from '@/components/ui/mui';

export default function MuiDemoPage() {
  return (
    <div className="container max-w-4xl mx-auto p-8">
      <MuiTypography variant="h3" className="mb-6">
        Material UI Integration Demo
      </MuiTypography>

      {/* Alert Examples */}
      <MuiStack spacing={2} className="mb-8">
        <MuiAlert severity="success" title="Success">
          MUI has been successfully integrated with Next.js!
        </MuiAlert>
        <MuiAlert severity="info" title="Info">
          These components work in server components.
        </MuiAlert>
        <MuiAlert severity="warning" title="Warning">
          Make sure to use wrapper components for server compatibility.
        </MuiAlert>
        <MuiAlert severity="error" title="Error">
          Direct MUI imports require 'use client' directive.
        </MuiAlert>
      </MuiStack>

      {/* Button Examples */}
      <MuiCard className="mb-8">
        <MuiCardContent>
          <MuiTypography variant="h5" className="mb-4">
            Buttons
          </MuiTypography>
          <MuiStack spacing={2} direction="row" flexWrap="wrap" gap={2}>
            <MuiButton variant="contained" color="primary">
              Primary
            </MuiButton>
            <MuiButton variant="contained" color="secondary">
              Secondary
            </MuiButton>
            <MuiButton variant="contained" color="success">
              Success
            </MuiButton>
            <MuiButton variant="contained" color="warning">
              Warning
            </MuiButton>
            <MuiButton variant="contained" color="error">
              Error
            </MuiButton>
            <MuiButton variant="outlined" color="primary">
              Outlined
            </MuiButton>
            <MuiButton variant="text" color="primary">
              Text
            </MuiButton>
          </MuiStack>
        </MuiCardContent>
      </MuiCard>

      {/* Typography Examples */}
      <MuiCard className="mb-8">
        <MuiCardContent>
          <MuiTypography variant="h5" className="mb-4">
            Typography
          </MuiTypography>
          <MuiStack spacing={2}>
            <MuiTypography variant="h1">Heading 1</MuiTypography>
            <MuiTypography variant="h2">Heading 2</MuiTypography>
            <MuiTypography variant="h3">Heading 3</MuiTypography>
            <MuiTypography variant="h4">Heading 4</MuiTypography>
            <MuiTypography variant="h5">Heading 5</MuiTypography>
            <MuiTypography variant="h6">Heading 6</MuiTypography>
            <MuiTypography variant="body1">
              Body 1 - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </MuiTypography>
            <MuiTypography variant="body2" color="textSecondary">
              Body 2 - Secondary text color for less emphasis.
            </MuiTypography>
            <MuiTypography variant="caption">Caption text</MuiTypography>
          </MuiStack>
        </MuiCardContent>
      </MuiCard>

      {/* Chip Examples */}
      <MuiCard className="mb-8">
        <MuiCardContent>
          <MuiTypography variant="h5" className="mb-4">
            Chips
          </MuiTypography>
          <MuiStack spacing={2} direction="row" flexWrap="wrap" gap={1}>
            <MuiChip label="Primary" color="primary" />
            <MuiChip label="Secondary" color="secondary" />
            <MuiChip label="Success" color="success" />
            <MuiChip label="Warning" color="warning" />
            <MuiChip label="Error" color="error" />
            <MuiChip label="Info" color="info" />
            <MuiChip label="Outlined" color="primary" variant="outlined" />
          </MuiStack>
        </MuiCardContent>
      </MuiCard>

      {/* Hybrid Example: MUI + Tailwind */}
      <MuiCard className="mb-8">
        <MuiCardContent>
          <MuiTypography variant="h5" className="mb-4">
            Hybrid: MUI + Tailwind CSS
          </MuiTypography>
          <p className="text-neutral-600 mb-4">
            You can combine MUI components with Tailwind utility classes:
          </p>
          <div className="flex gap-4 flex-wrap">
            <MuiButton variant="contained" color="primary">
              MUI Button
            </MuiButton>
            <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors">
              Tailwind Button
            </button>
          </div>
        </MuiCardContent>
      </MuiCard>

      {/* Usage Example */}
      <MuiCard>
        <MuiCardContent>
          <MuiTypography variant="h5" className="mb-4">
            Usage
          </MuiTypography>
          <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
            {`// Import from @/components/ui/mui
import { MuiButton, MuiCard } from '@/components/ui/mui';

// Use in server components (no 'use client' needed)
export default function MyPage() {
  return (
    <MuiCard>
      <MuiButton variant="contained">Click Me</MuiButton>
    </MuiCard>
  );
}`}
          </pre>
        </MuiCardContent>
      </MuiCard>
    </div>
  );
}
