// Figures from the publication
// Source: IRENA (2025), Participatory processes for strategic energy planning:
// A toolkit for national energy planners.
//
// The figures are vector drawings in the PDF, rendered to PNG by
// scripts/extract-figures.py. Each caption is part of the rendered image, so
// it is not repeated in the markup; the title below is the alt text.

import figure1 from '../assets/figures/figure-1.png';
import figure2 from '../assets/figures/figure-2.png';
import figure3 from '../assets/figures/figure-3.png';
import figure4 from '../assets/figures/figure-4.png';
import figure5 from '../assets/figures/figure-5.png';

export interface Figure {
  number: number;
  /** Caption as printed, without the "Figure N" label. */
  title: string;
  src: string;
  /** Section of the publication the figure appears in. */
  toolkitSection: string;
}

/**
 * Process flow diagrams, one per chapter 5 case study, keyed by case study id.
 * Loaded as a glob so adding one is a matter of running the extract script.
 */
const flowModules = import.meta.glob('../assets/process-flows/*.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

export const processFlows: Record<string, string> = Object.fromEntries(
  Object.entries(flowModules).map(([path, src]) => [
    path.replace(/^.*\/(.+)\.png$/, '$1'),
    src,
  ])
);

export const figures: Record<number, Figure> = {
  1: {
    number: 1,
    title: 'Overview and objectives of the participatory energy planning process',
    src: figure1,
    toolkitSection: '1.1',
  },
  2: {
    number: 2,
    title: 'Mental model of a stakeholder-led energy planning process',
    src: figure2,
    toolkitSection: '2.1',
  },
  3: {
    number: 3,
    title: 'Allocation of energy planning capacity in the national context',
    src: figure3,
    toolkitSection: '2.2',
  },
  4: {
    number: 4,
    title: 'Categorisation of engagement tools and activities',
    src: figure4,
    toolkitSection: '4',
  },
  5: {
    number: 5,
    title: 'Possible participants in a working group or steering committee',
    src: figure5,
    toolkitSection: '4.2.1',
  },
};
