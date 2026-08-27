export interface IQQuestion45 {
  id: number;
  section: 1 | 2 | 3 | 4 | 5;
  sectionName: string;
  category: 'visual_matrix' | 'spatial_figure' | 'numerical_quantitative' | 'logical_verbal' | 'sequence_abstract';
  difficulty: 'easy' | 'easy_medium' | 'medium' | 'medium_hard' | 'hard';
  difficultyWeight: number;
  prompt: string;
  questionType: 'svg_matrix' | 'svg_sequence' | 'svg_analogy' | 'svg_spatial' | 'text' | 'numeric_pattern';
  svgData?: {
    matrixType?: '2x2' | '3x3' | 'analogy' | 'sequence' | 'shape_count' | 'pattern_grid';
    gridCells?: string[];
    missingIndex?: number;
    options?: string[];
  };
  options: {
    label: string;
    text: string;
    svgContent?: string;
  }[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export const QUESTION_BANK_45: IQQuestion45[] = [
  // =========================================================================
  // SECTION 1: VISUAL PATTERN & MATRIX REASONING (12 Questions: Q1 - Q12)
  // =========================================================================

  // Q1 (Correct: B)
  {
    id: 1,
    section: 1,
    sectionName: 'Visual Pattern & Matrix Reasoning',
    category: 'visual_matrix',
    difficulty: 'easy',
    difficultyWeight: 1.0,
    prompt: 'Select the missing tile to complete the 2x2 visual pattern.',
    questionType: 'svg_matrix',
    svgData: {
      matrixType: '2x2',
      gridCells: [
        '<circle cx="50" cy="50" r="30" fill="#690b1b" />',
        '<circle cx="50" cy="50" r="30" fill="#690b1b" /><circle cx="50" cy="50" r="15" fill="#ffffff" />',
        '<rect x="20" y="20" width="60" height="60" fill="#690b1b" />',
        '?'
      ],
      missingIndex: 3
    },
    options: [
      { label: 'A', text: 'Solid square only', svgContent: '<rect x="20" y="20" width="60" height="60" fill="#690b1b" />' },
      { label: 'B', text: 'Solid square with white inner square cutout', svgContent: '<rect x="20" y="20" width="60" height="60" fill="#690b1b" /><rect x="35" y="35" width="30" height="30" fill="#ffffff" />' },
      { label: 'C', text: 'Solid circle', svgContent: '<circle cx="50" cy="50" r="30" fill="#690b1b" />' },
      { label: 'D', text: 'Hollow square', svgContent: '<rect x="20" y="20" width="60" height="60" fill="#ffffff" stroke="#690b1b" stroke-width="4" />' }
    ],
    correctOption: 'B',
    explanation: 'Row 1 introduces a white inner cutout inside the shape. Applying the same rule to the square in Row 2 produces a square with a white inner square cutout.'
  },

  // Q2 (Correct: C)
  {
    id: 2,
    section: 1,
    sectionName: 'Visual Pattern & Matrix Reasoning',
    category: 'visual_matrix',
    difficulty: 'easy',
    difficultyWeight: 1.0,
    prompt: 'Which option completes the directional line progression across the grid?',
    questionType: 'svg_matrix',
    svgData: {
      matrixType: '2x2',
      gridCells: [
        '<line x1="10" y1="50" x2="90" y2="50" stroke="#690b1b" stroke-width="6" />',
        '<line x1="50" y1="10" x2="50" y2="90" stroke="#690b1b" stroke-width="6" />',
        '<line x1="15" y1="85" x2="85" y2="15" stroke="#690b1b" stroke-width="6" />',
        '?'
      ],
      missingIndex: 3
    },
    options: [
      { label: 'A', text: 'Horizontal line', svgContent: '<line x1="10" y1="50" x2="90" y2="50" stroke="#690b1b" stroke-width="6" />' },
      { label: 'B', text: 'Vertical line', svgContent: '<line x1="50" y1="10" x2="50" y2="90" stroke="#690b1b" stroke-width="6" />' },
      { label: 'C', text: 'Top-left to bottom-right diagonal line', svgContent: '<line x1="15" y1="15" x2="85" y2="85" stroke="#690b1b" stroke-width="6" />' },
      { label: 'D', text: 'Circle contour', svgContent: '<circle cx="50" cy="50" r="25" fill="none" stroke="#690b1b" stroke-width="6" />' }
    ],
    correctOption: 'C',
    explanation: 'The top row features horizontal and vertical cardinal lines. The bottom row features diagonal lines. The missing line is the orthogonal diagonal from top-left to bottom-right.'
  },

  // Q3 (Correct: D)
  {
    id: 3,
    section: 1,
    sectionName: 'Visual Pattern & Matrix Reasoning',
    category: 'visual_matrix',
    difficulty: 'easy',
    difficultyWeight: 1.0,
    prompt: 'Identify the tile that completes the dot addition sequence.',
    questionType: 'svg_matrix',
    svgData: {
      matrixType: '2x2',
      gridCells: [
        '<circle cx="50" cy="50" r="10" fill="#690b1b" />',
        '<circle cx="35" cy="50" r="10" fill="#690b1b" /><circle cx="65" cy="50" r="10" fill="#690b1b" />',
        '<circle cx="35" cy="35" r="10" fill="#690b1b" /><circle cx="65" cy="35" r="10" fill="#690b1b" /><circle cx="50" cy="65" r="10" fill="#690b1b" />',
        '?'
      ],
      missingIndex: 3
    },
    options: [
      { label: 'A', text: '1 central dot', svgContent: '<circle cx="50" cy="50" r="10" fill="#690b1b" />' },
      { label: 'B', text: '2 horizontal dots', svgContent: '<circle cx="35" cy="50" r="10" fill="#690b1b" /><circle cx="65" cy="50" r="10" fill="#690b1b" />' },
      { label: 'C', text: '3 vertical dots', svgContent: '<circle cx="50" cy="20" r="10" fill="#690b1b" /><circle cx="50" cy="50" r="10" fill="#690b1b" /><circle cx="50" cy="80" r="10" fill="#690b1b" />' },
      { label: 'D', text: '4 dots forming a square', svgContent: '<circle cx="35" cy="35" r="10" fill="#690b1b" /><circle cx="65" cy="35" r="10" fill="#690b1b" /><circle cx="35" cy="65" r="10" fill="#690b1b" /><circle cx="65" cy="65" r="10" fill="#690b1b" />' }
    ],
    correctOption: 'D',
    explanation: 'The grid increases dot count sequentially: 1 dot -> 2 dots -> 3 dots -> 4 dots arranged in a balanced 2x2 layout.'
  },

  // Q4 (Correct: A)
  {
    id: 4,
    section: 1,
    sectionName: 'Visual Pattern & Matrix Reasoning',
    category: 'visual_matrix',
    difficulty: 'easy',
    difficultyWeight: 1.0,
    prompt: 'Determine the missing geometric element.',
    questionType: 'svg_matrix',
    svgData: {
      matrixType: '2x2',
      gridCells: [
        '<polygon points="50,15 85,85 15,85" fill="none" stroke="#690b1b" stroke-width="5" />',
        '<polygon points="50,15 85,85 15,85" fill="#690b1b" />',
        '<rect x="20" y="20" width="60" height="60" fill="none" stroke="#690b1b" stroke-width="5" />',
        '?'
      ],
      missingIndex: 3
    },
    options: [
      { label: 'A', text: 'Solid filled square', svgContent: '<rect x="20" y="20" width="60" height="60" fill="#690b1b" />' },
      { label: 'B', text: 'Hollow stroke square', svgContent: '<rect x="20" y="20" width="60" height="60" fill="none" stroke="#690b1b" stroke-width="5" />' },
      { label: 'C', text: 'Solid filled circle', svgContent: '<circle cx="50" cy="50" r="30" fill="#690b1b" />' },
      { label: 'D', text: 'Solid filled triangle', svgContent: '<polygon points="50,15 85,85 15,85" fill="#690b1b" />' }
    ],
    correctOption: 'A',
    explanation: 'Moving horizontally from left to right converts outline shapes into solid filled shapes of the same geometry. The outline square becomes a solid filled square.'
  },

  // Q5 (Correct: B)
  {
    id: 5,
    section: 1,
    sectionName: 'Visual Pattern & Matrix Reasoning',
    category: 'visual_matrix',
    difficulty: 'easy_medium',
    difficultyWeight: 1.1,
    prompt: 'Which pattern completes the 3x3 matrix along both rows and columns?',
    questionType: 'svg_matrix',
    svgData: {
      matrixType: '3x3',
      gridCells: [
        '<circle cx="50" cy="50" r="25" fill="#690b1b" />',
        '<rect x="25" y="25" width="50" height="50" fill="#690b1b" />',
        '<polygon points="50,20 80,80 20,80" fill="#690b1b" />',
        '<rect x="25" y="25" width="50" height="50" fill="#690b1b" />',
        '<polygon points="50,20 80,80 20,80" fill="#690b1b" />',
        '<circle cx="50" cy="50" r="25" fill="#690b1b" />',
        '<polygon points="50,20 80,80 20,80" fill="#690b1b" />',
        '<circle cx="50" cy="50" r="25" fill="#690b1b" />',
        '?'
      ],
      missingIndex: 8
    },
    options: [
      { label: 'A', text: 'Solid circle', svgContent: '<circle cx="50" cy="50" r="25" fill="#690b1b" />' },
      { label: 'B', text: 'Solid square', svgContent: '<rect x="25" y="25" width="50" height="50" fill="#690b1b" />' },
      { label: 'C', text: 'Solid triangle', svgContent: '<polygon points="50,20 80,80 20,80" fill="#690b1b" />' },
      { label: 'D', text: 'Small circle', svgContent: '<circle cx="50" cy="50" r="15" fill="#690b1b" />' }
    ],
    correctOption: 'B',
    explanation: 'Each row and column must contain exactly one Circle, one Square, and one Triangle (Latin square pattern). Row 3 contains Triangle and Circle, leaving Square as the missing shape.'
  },

  // Q6 (Correct: C)
  {
    id: 6,
    section: 1,
    sectionName: 'Visual Pattern & Matrix Reasoning',
    category: 'visual_matrix',
    difficulty: 'easy_medium',
    difficultyWeight: 1.1,
    prompt: 'Select the missing quadrant shape to complete the rotational pattern.',
    questionType: 'svg_matrix',
    svgData: {
      matrixType: '2x2',
      gridCells: [
        '<path d="M50 50 L50 15 A35 35 0 0 1 85 50 Z" fill="#690b1b" />',
        '<path d="M50 50 L85 50 A35 35 0 0 1 50 85 Z" fill="#690b1b" />',
        '<path d="M50 50 L15 50 A35 35 0 0 1 50 15 Z" fill="#690b1b" />',
        '?'
      ],
      missingIndex: 3
    },
    options: [
      { label: 'A', text: 'Top-right quadrant shaded', svgContent: '<path d="M50 50 L50 15 A35 35 0 0 1 85 50 Z" fill="#690b1b" />' },
      { label: 'B', text: 'Bottom-right quadrant shaded', svgContent: '<path d="M50 50 L85 50 A35 35 0 0 1 50 85 Z" fill="#690b1b" />' },
      { label: 'C', text: 'Bottom-left quadrant shaded', svgContent: '<path d="M50 50 L50 85 A35 35 0 0 1 15 50 Z" fill="#690b1b" />' },
      { label: 'D', text: 'Full circle', svgContent: '<circle cx="50" cy="50" r="35" fill="#690b1b" />' }
    ],
    correctOption: 'C',
    explanation: 'The shaded sector rotates 90° clockwise in each step: Top-Right (Q1) -> Bottom-Right (Q4) -> Bottom-Left (Q3).'
  },

  // Q7 (Correct: D)
  {
    id: 7,
    section: 1,
    sectionName: 'Visual Pattern & Matrix Reasoning',
    category: 'visual_matrix',
    difficulty: 'medium',
    difficultyWeight: 1.3,
    prompt: 'Identify the pattern resulting from line subtraction across columns.',
    questionType: 'svg_matrix',
    svgData: {
      matrixType: '3x3',
      gridCells: [
        '<line x1="20" y1="50" x2="80" y2="50" stroke="#690b1b" stroke-width="5" /><line x1="50" y1="20" x2="50" y2="80" stroke="#690b1b" stroke-width="5" />',
        '<line x1="20" y1="50" x2="80" y2="50" stroke="#690b1b" stroke-width="5" />',
        '<line x1="50" y1="20" x2="50" y2="80" stroke="#690b1b" stroke-width="5" />',
        '<line x1="20" y1="20" x2="80" y2="80" stroke="#690b1b" stroke-width="5" /><line x1="80" y1="20" x2="20" y2="80" stroke="#690b1b" stroke-width="5" />',
        '<line x1="20" y1="20" x2="80" y2="80" stroke="#690b1b" stroke-width="5" />',
        '<line x1="80" y1="20" x2="20" y2="80" stroke="#690b1b" stroke-width="5" />',
        '<rect x="25" y="25" width="50" height="50" fill="none" stroke="#690b1b" stroke-width="5" /><line x1="50" y1="25" x2="50" y2="75" stroke="#690b1b" stroke-width="5" />',
        '<line x1="50" y1="25" x2="50" y2="75" stroke="#690b1b" stroke-width="5" />',
        '?'
      ],
      missingIndex: 8
    },
    options: [
      { label: 'A', text: 'Vertical line only', svgContent: '<line x1="50" y1="25" x2="50" y2="75" stroke="#690b1b" stroke-width="5" />' },
      { label: 'B', text: 'Horizontal line only', svgContent: '<line x1="25" y1="50" x2="75" y2="50" stroke="#690b1b" stroke-width="5" />' },
      { label: 'C', text: 'Circle outline', svgContent: '<circle cx="50" cy="50" r="25" fill="none" stroke="#690b1b" stroke-width="5" />' },
      { label: 'D', text: 'Hollow square contour', svgContent: '<rect x="25" y="25" width="50" height="50" fill="none" stroke="#690b1b" stroke-width="5" />' }
    ],
    correctOption: 'D',
    explanation: 'Column 1 minus Column 2 equals Column 3. Removing the vertical line from (Square + Vertical line) leaves the hollow Square contour.'
  },

  // Q8 (Correct: A)
  {
    id: 8,
    section: 1,
    sectionName: 'Visual Pattern & Matrix Reasoning',
    category: 'visual_matrix',
    difficulty: 'medium',
    difficultyWeight: 1.3,
    prompt: 'Which figure represents the logical addition of Column 1 and Column 2?',
    questionType: 'svg_matrix',
    svgData: {
      matrixType: '2x2',
      gridCells: [
        '<circle cx="35" cy="50" r="20" fill="#690b1b" />',
        '<circle cx="65" cy="50" r="20" fill="#690b1b" />',
        '<circle cx="35" cy="50" r="20" fill="#690b1b" /><circle cx="65" cy="50" r="20" fill="#690b1b" />',
        '?'
      ],
      missingIndex: 3
    },
    options: [
      { label: 'A', text: 'Two separate circles combined', svgContent: '<circle cx="35" cy="50" r="20" fill="#690b1b" /><circle cx="65" cy="50" r="20" fill="#690b1b" />' },
      { label: 'B', text: 'Single central circle', svgContent: '<circle cx="50" cy="50" r="20" fill="#690b1b" />' },
      { label: 'C', text: 'Central square', svgContent: '<rect x="30" y="30" width="40" height="40" fill="#690b1b" />' },
      { label: 'D', text: 'Single outline circle', svgContent: '<circle cx="35" cy="50" r="20" fill="none" stroke="#690b1b" stroke-width="4" />' }
    ],
    correctOption: 'A',
    explanation: 'Row 2 combines the left and right components from Row 1 together into a single combined composite figure.'
  },

  // Q9 (Correct: B)
  {
    id: 9,
    section: 1,
    sectionName: 'Visual Pattern & Matrix Reasoning',
    category: 'visual_matrix',
    difficulty: 'medium_hard',
    difficultyWeight: 1.5,
    prompt: 'Determine the missing element in this 3x3 nested ring pattern.',
    questionType: 'svg_matrix',
    svgData: {
      matrixType: '3x3',
      gridCells: [
        '<circle cx="50" cy="50" r="35" stroke="#690b1b" stroke-width="4" fill="none" />',
        '<circle cx="50" cy="50" r="35" stroke="#690b1b" stroke-width="4" fill="none" /><circle cx="50" cy="50" r="22" stroke="#690b1b" stroke-width="4" fill="none" />',
        '<circle cx="50" cy="50" r="35" stroke="#690b1b" stroke-width="4" fill="none" /><circle cx="50" cy="50" r="22" stroke="#690b1b" stroke-width="4" fill="none" /><circle cx="50" cy="50" r="10" fill="#690b1b" />',
        '<rect x="15" y="15" width="70" height="70" stroke="#690b1b" stroke-width="4" fill="none" />',
        '<rect x="15" y="15" width="70" height="70" stroke="#690b1b" stroke-width="4" fill="none" /><rect x="30" y="30" width="40" height="40" stroke="#690b1b" stroke-width="4" fill="none" />',
        '<rect x="15" y="15" width="70" height="70" stroke="#690b1b" stroke-width="4" fill="none" /><rect x="30" y="30" width="40" height="40" stroke="#690b1b" stroke-width="4" fill="none" /><rect x="42" y="42" width="16" height="16" fill="#690b1b" />',
        '<polygon points="50,15 85,85 15,85" stroke="#690b1b" stroke-width="4" fill="none" />',
        '<polygon points="50,15 85,85 15,85" stroke="#690b1b" stroke-width="4" fill="none" /><polygon points="50,35 70,75 30,75" stroke="#690b1b" stroke-width="4" fill="none" />',
        '?'
      ],
      missingIndex: 8
    },
    options: [
      { label: 'A', text: 'Single outer triangle', svgContent: '<polygon points="50,15 85,85 15,85" stroke="#690b1b" stroke-width="4" fill="none" />' },
      { label: 'B', text: 'Outer triangle + inner triangle + solid core dot', svgContent: '<polygon points="50,15 85,85 15,85" stroke="#690b1b" stroke-width="4" fill="none" /><polygon points="50,35 70,75 30,75" stroke="#690b1b" stroke-width="4" fill="none" /><circle cx="50" cy="62" r="6" fill="#690b1b" />' },
      { label: 'C', text: 'Single outer circle', svgContent: '<circle cx="50" cy="50" r="35" stroke="#690b1b" stroke-width="4" fill="none" />' },
      { label: 'D', text: 'Solid square', svgContent: '<rect x="15" y="15" width="70" height="70" fill="#690b1b" />' }
    ],
    correctOption: 'B',
    explanation: 'Across each row, the geometric structure adds an inner concentric border in Column 2 and a solid central core in Column 3.'
  },

  // Q10 (Correct: C)
  {
    id: 10,
    section: 1,
    sectionName: 'Visual Pattern & Matrix Reasoning',
    category: 'visual_matrix',
    difficulty: 'medium_hard',
    difficultyWeight: 1.5,
    prompt: 'Which option resolves the line direction flip from main diagonal to anti-diagonal?',
    questionType: 'svg_matrix',
    svgData: {
      matrixType: '2x2',
      gridCells: [
        '<circle cx="50" cy="50" r="30" fill="none" stroke="#690b1b" stroke-width="4" /><line x1="20" y1="20" x2="80" y2="80" stroke="#690b1b" stroke-width="4" />',
        '<circle cx="50" cy="50" r="30" fill="none" stroke="#690b1b" stroke-width="4" /><line x1="80" y1="20" x2="20" y2="80" stroke="#690b1b" stroke-width="4" />',
        '<rect x="25" y="25" width="50" height="50" fill="none" stroke="#690b1b" stroke-width="4" /><line x1="20" y1="20" x2="80" y2="80" stroke="#690b1b" stroke-width="4" />',
        '?'
      ],
      missingIndex: 3
    },
    options: [
      { label: 'A', text: 'Square frame with main diagonal line', svgContent: '<rect x="25" y="25" width="50" height="50" fill="none" stroke="#690b1b" stroke-width="4" /><line x1="20" y1="20" x2="80" y2="80" stroke="#690b1b" stroke-width="4" />' },
      { label: 'B', text: 'Solid circle', svgContent: '<circle cx="50" cy="50" r="30" fill="#690b1b" />' },
      { label: 'C', text: 'Square frame with anti-diagonal line', svgContent: '<rect x="25" y="25" width="50" height="50" fill="none" stroke="#690b1b" stroke-width="4" /><line x1="80" y1="20" x2="20" y2="80" stroke="#690b1b" stroke-width="4" />' },
      { label: 'D', text: 'Vertical line', svgContent: '<line x1="50" y1="10" x2="50" y2="90" stroke="#690b1b" stroke-width="4" />' }
    ],
    correctOption: 'C',
    explanation: 'Column 1 features a main diagonal line (\). Column 2 flips the interior line to an anti-diagonal line (/). Applying this to the square in Row 2 produces Option C.'
  },

  // Q11 (Correct: D)
  {
    id: 11,
    section: 1,
    sectionName: 'Visual Pattern & Matrix Reasoning',
    category: 'visual_matrix',
    difficulty: 'hard',
    difficultyWeight: 1.8,
    prompt: 'Determine the missing matrix cell based on cumulative corner dot rotation.',
    questionType: 'svg_matrix',
    svgData: {
      matrixType: '2x2',
      gridCells: [
        '<rect x="20" y="20" width="60" height="60" fill="none" stroke="#690b1b" stroke-width="4" /><circle cx="20" cy="20" r="8" fill="#690b1b" />',
        '<rect x="20" y="20" width="60" height="60" fill="none" stroke="#690b1b" stroke-width="4" /><circle cx="80" cy="20" r="8" fill="#690b1b" />',
        '<rect x="20" y="20" width="60" height="60" fill="none" stroke="#690b1b" stroke-width="4" /><circle cx="20" cy="80" r="8" fill="#690b1b" />',
        '?'
      ],
      missingIndex: 3
    },
    options: [
      { label: 'A', text: 'Dot at top-left corner', svgContent: '<rect x="20" y="20" width="60" height="60" fill="none" stroke="#690b1b" stroke-width="4" /><circle cx="20" cy="20" r="8" fill="#690b1b" />' },
      { label: 'B', text: 'Solid square without dot', svgContent: '<rect x="20" y="20" width="60" height="60" fill="#690b1b" />' },
      { label: 'C', text: 'Dot in center', svgContent: '<rect x="20" y="20" width="60" height="60" fill="none" stroke="#690b1b" stroke-width="4" /><circle cx="50" cy="50" r="8" fill="#690b1b" />' },
      { label: 'D', text: 'Dot at bottom-right corner', svgContent: '<rect x="20" y="20" width="60" height="60" fill="none" stroke="#690b1b" stroke-width="4" /><circle cx="80" cy="80" r="8" fill="#690b1b" />' }
    ],
    correctOption: 'D',
    explanation: 'The corner dot moves clockwise around the perimeter of the square: Top-Left (R1C1) -> Top-Right (R1C2) -> Bottom-Left (R2C1) -> Bottom-Right (R2C2).'
  },

  // Q12 (Correct: A)
  {
    id: 12,
    section: 1,
    sectionName: 'Visual Pattern & Matrix Reasoning',
    category: 'visual_matrix',
    difficulty: 'hard',
    difficultyWeight: 2.0,
    prompt: 'Solve the complex 3x3 high-discrimination pattern matrix.',
    questionType: 'svg_matrix',
    svgData: {
      matrixType: '3x3',
      gridCells: [
        '<circle cx="50" cy="50" r="30" fill="none" stroke="#690b1b" stroke-width="4" /><line x1="50" y1="20" x2="50" y2="80" stroke="#690b1b" stroke-width="4" />',
        '<circle cx="50" cy="50" r="30" fill="none" stroke="#690b1b" stroke-width="4" /><line x1="20" y1="50" x2="80" y2="50" stroke="#690b1b" stroke-width="4" />',
        '<circle cx="50" cy="50" r="30" fill="none" stroke="#690b1b" stroke-width="4" /><line x1="50" y1="20" x2="50" y2="80" stroke="#690b1b" stroke-width="4" /><line x1="20" y1="50" x2="80" y2="50" stroke="#690b1b" stroke-width="4" />',
        '<rect x="25" y="25" width="50" height="50" fill="none" stroke="#690b1b" stroke-width="4" /><line x1="25" y1="25" x2="75" y2="75" stroke="#690b1b" stroke-width="4" />',
        '<rect x="25" y="25" width="50" height="50" fill="none" stroke="#690b1b" stroke-width="4" /><line x1="75" y1="25" x2="25" y2="75" stroke="#690b1b" stroke-width="4" />',
        '<rect x="25" y="25" width="50" height="50" fill="none" stroke="#690b1b" stroke-width="4" /><line x1="25" y1="25" x2="75" y2="75" stroke="#690b1b" stroke-width="4" /><line x1="75" y1="25" x2="25" y2="75" stroke="#690b1b" stroke-width="4" />',
        '<polygon points="50,15 85,85 15,85" fill="none" stroke="#690b1b" stroke-width="4" /><line x1="50" y1="15" x2="50" y2="85" stroke="#690b1b" stroke-width="4" />',
        '<polygon points="50,15 85,85 15,85" fill="none" stroke="#690b1b" stroke-width="4" /><line x1="30" y1="50" x2="70" y2="50" stroke="#690b1b" stroke-width="4" />',
        '?'
      ],
      missingIndex: 8
    },
    options: [
      { label: 'A', text: 'Triangle with both vertical and horizontal bisecting lines', svgContent: '<polygon points="50,15 85,85 15,85" fill="none" stroke="#690b1b" stroke-width="4" /><line x1="50" y1="15" x2="50" y2="85" stroke="#690b1b" stroke-width="4" /><line x1="30" y1="50" x2="70" y2="50" stroke="#690b1b" stroke-width="4" />' },
      { label: 'B', text: 'Solid triangle', svgContent: '<polygon points="50,15 85,85 15,85" fill="#690b1b" />' },
      { label: 'C', text: 'Plain outline triangle', svgContent: '<polygon points="50,15 85,85 15,85" fill="none" stroke="#690b1b" stroke-width="4" />' },
      { label: 'D', text: 'Circle outline', svgContent: '<circle cx="50" cy="50" r="30" fill="none" stroke="#690b1b" stroke-width="4" />' }
    ],
    correctOption: 'A',
    explanation: 'Column 3 is the logical addition (OR operation) of the line features present in Column 1 and Column 2. Combining the vertical bisector and horizontal bar gives Option A.'
  },

  // =========================================================================
  // SECTION 2: SPATIAL / FIGURE REASONING (9 Questions: Q13 - Q21)
  // =========================================================================

  // Q13 (Correct: B)
  {
    id: 13,
    section: 2,
    sectionName: 'Spatial / Figure Reasoning',
    category: 'spatial_figure',
    difficulty: 'easy',
    difficultyWeight: 1.0,
    prompt: 'Which figure represents an exact 90-degree clockwise rotation of the reference L-shape?',
    questionType: 'svg_spatial',
    svgData: {
      gridCells: ['<path d="M30 20 L30 80 L80 80 L80 60 L50 60 L50 20 Z" fill="#690b1b" />']
    },
    options: [
      { label: 'A', text: 'Original upright L-block', svgContent: '<path d="M30 20 L30 80 L80 80 L80 60 L50 60 L50 20 Z" fill="#690b1b" />' },
      { label: 'B', text: '90° Clockwise rotated L-block', svgContent: '<path d="M20 30 L80 30 L80 50 L40 50 L40 80 L20 80 Z" fill="#690b1b" />' },
      { label: 'C', text: 'Inverted mirror L-block', svgContent: '<path d="M20 20 L70 20 L70 40 L40 40 L40 80 L20 80 Z" fill="#690b1b" />' },
      { label: 'D', text: 'Circle block', svgContent: '<circle cx="50" cy="50" r="30" fill="#690b1b" />' }
    ],
    correctOption: 'B',
    explanation: 'Rotating the vertical arm of the L-shape 90 degrees clockwise points it to the right along the top axis, producing Option B.'
  },

  // Q14 (Correct: C)
  {
    id: 14,
    section: 2,
    sectionName: 'Spatial / Figure Reasoning',
    category: 'spatial_figure',
    difficulty: 'easy',
    difficultyWeight: 1.0,
    prompt: 'Identify the exact horizontal mirror reflection of the given asymmetrical figure.',
    questionType: 'svg_spatial',
    svgData: {
      gridCells: ['<path d="M20 50 L50 20 L80 80 Z" fill="#690b1b" /><circle cx="25" cy="70" r="8" fill="#ffffff" />']
    },
    options: [
      { label: 'A', text: 'Original unmirrored figure', svgContent: '<path d="M20 50 L50 20 L80 80 Z" fill="#690b1b" /><circle cx="25" cy="70" r="8" fill="#ffffff" />' },
      { label: 'B', text: 'Vertically flipped figure', svgContent: '<path d="M20 20 L50 80 L80 20 Z" fill="#690b1b" /><circle cx="75" cy="30" r="8" fill="#ffffff" />' },
      { label: 'C', text: 'Triangle with white dot mirrored to the bottom-right', svgContent: '<path d="M20 50 L50 20 L80 80 Z" fill="#690b1b" /><circle cx="75" cy="70" r="8" fill="#ffffff" />' },
      { label: 'D', text: 'Outline triangle without dot', svgContent: '<path d="M20 50 L50 20 L80 80 Z" fill="none" stroke="#690b1b" stroke-width="4" />' }
    ],
    correctOption: 'C',
    explanation: 'Horizontal reflection across the central vertical axis keeps the triangle symmetric while reflecting the small white dot from bottom-left to bottom-right.'
  },

  // Q15 (Correct: D)
  {
    id: 15,
    section: 2,
    sectionName: 'Spatial / Figure Reasoning',
    category: 'spatial_figure',
    difficulty: 'easy_medium',
    difficultyWeight: 1.1,
    prompt: 'Figure A is to Figure B as Figure C is to ? (Figure Analogy)',
    questionType: 'svg_analogy',
    svgData: {
      gridCells: [
        '<circle cx="50" cy="50" r="30" fill="none" stroke="#690b1b" stroke-width="4" />',
        '<circle cx="50" cy="50" r="30" fill="#690b1b" />',
        '<polygon points="50,20 80,80 20,80" fill="none" stroke="#690b1b" stroke-width="4" />',
        '?'
      ]
    },
    options: [
      { label: 'A', text: 'Outline triangle', svgContent: '<polygon points="50,20 80,80 20,80" fill="none" stroke="#690b1b" stroke-width="4" />' },
      { label: 'B', text: 'Solid circle', svgContent: '<circle cx="50" cy="50" r="30" fill="#690b1b" />' },
      { label: 'C', text: 'Solid square', svgContent: '<rect x="25" y="25" width="50" height="50" fill="#690b1b" />' },
      { label: 'D', text: 'Solid filled triangle', svgContent: '<polygon points="50,20 80,80 20,80" fill="#690b1b" />' }
    ],
    correctOption: 'D',
    explanation: 'The transformation rule converts an outline shape into a solid filled shape of identical geometry. Applying this to the outline triangle yields a solid filled triangle.'
  },

  // Q16 (Correct: A)
  {
    id: 16,
    section: 2,
    sectionName: 'Spatial / Figure Reasoning',
    category: 'spatial_figure',
    difficulty: 'medium',
    difficultyWeight: 1.3,
    prompt: 'Which 3D cube face configuration can be formed by folding the given flat net?',
    questionType: 'svg_spatial',
    svgData: {
      gridCells: ['<rect x="35" y="10" width="30" height="30" fill="none" stroke="#690b1b" stroke-width="3" /><rect x="5" y="40" width="90" height="30" fill="none" stroke="#690b1b" stroke-width="3" /><rect x="35" y="70" width="30" height="30" fill="none" stroke="#690b1b" stroke-width="3" /><circle cx="50" cy="25" r="6" fill="#690b1b" /><rect x="45" y="50" width="10" height="10" fill="#690b1b" />']
    },
    options: [
      { label: 'A', text: 'Isometric cube view with top dot face adjacent to square face', svgContent: '<polygon points="25,40 50,20 75,40 50,60" fill="none" stroke="#690b1b" stroke-width="3" /><polygon points="25,40 50,60 50,90 25,70" fill="none" stroke="#690b1b" stroke-width="3" /><polygon points="75,40 50,60 50,90 75,70" fill="none" stroke="#690b1b" stroke-width="3" /><circle cx="50" cy="40" r="5" fill="#690b1b" />' },
      { label: 'B', text: 'Flat solid square', svgContent: '<rect x="20" y="20" width="60" height="60" fill="#690b1b" />' },
      { label: 'C', text: 'Flat circle contour', svgContent: '<circle cx="50" cy="50" r="30" fill="none" stroke="#690b1b" stroke-width="4" />' },
      { label: 'D', text: 'Flat solid triangle', svgContent: '<polygon points="50,15 85,85 15,85" fill="#690b1b" />' }
    ],
    correctOption: 'A',
    explanation: 'Folding the cross-net into a 3D cube brings the top dot face and central square face into adjacent perpendicular contact.'
  },

  // Q17 (Correct: B)
  {
    id: 17,
    section: 2,
    sectionName: 'Spatial / Figure Reasoning',
    category: 'spatial_figure',
    difficulty: 'medium',
    difficultyWeight: 1.3,
    prompt: 'How many total triangles are formed in this subdivided geometric figure?',
    questionType: 'svg_spatial',
    svgData: {
      gridCells: ['<polygon points="50,10 90,90 10,90" fill="none" stroke="#690b1b" stroke-width="4" /><line x1="50" y1="10" x2="50" y2="90" stroke="#690b1b" stroke-width="3" /><line x1="30" y1="50" x2="70" y2="50" stroke="#690b1b" stroke-width="3" />']
    },
    options: [
      { label: 'A', text: '6 triangles' },
      { label: 'B', text: '8 triangles' },
      { label: 'C', text: '10 triangles' },
      { label: 'D', text: '12 triangles' }
    ],
    correctOption: 'B',
    explanation: 'The figure contains 2 small top triangles, 2 lower trapezoid-divided triangles, 2 medium left/right half triangles, 1 inner upper triangle, and 1 large outer bounding triangle = 8 total.'
  },

  // Q18 (Correct: C)
  {
    id: 18,
    section: 2,
    sectionName: 'Spatial / Figure Reasoning',
    category: 'spatial_figure',
    difficulty: 'medium_hard',
    difficultyWeight: 1.5,
    prompt: 'Select the figure that displays correct 180-degree spatial inversion with inverted shading.',
    questionType: 'svg_spatial',
    svgData: {
      gridCells: ['<rect x="25" y="25" width="50" height="50" fill="none" stroke="#690b1b" stroke-width="4" /><polygon points="25,25 75,25 50,75" fill="#690b1b" />']
    },
    options: [
      { label: 'A', text: 'Original un-inverted figure', svgContent: '<rect x="25" y="25" width="50" height="50" fill="none" stroke="#690b1b" stroke-width="4" /><polygon points="25,25 75,25 50,75" fill="#690b1b" />' },
      { label: 'B', text: 'Hollow square contour', svgContent: '<rect x="25" y="25" width="50" height="50" fill="none" stroke="#690b1b" stroke-width="4" />' },
      { label: 'C', text: 'Solid square background with inverted white upward triangle', svgContent: '<rect x="25" y="25" width="50" height="50" fill="#690b1b" /><polygon points="25,75 75,75 50,25" fill="#ffffff" />' },
      { label: 'D', text: 'Solid circle', svgContent: '<circle cx="50" cy="50" r="30" fill="#690b1b" />' }
    ],
    correctOption: 'C',
    explanation: 'A 180° rotation flips the downward triangle upward, while color inversion transforms the dark triangle to white and the white frame to solid dark.'
  },

  // Q19 (Correct: D)
  {
    id: 19,
    section: 2,
    sectionName: 'Spatial / Figure Reasoning',
    category: 'spatial_figure',
    difficulty: 'hard',
    difficultyWeight: 1.8,
    prompt: 'Which cube is identical to the target cube after a combined roll and pitch rotation?',
    questionType: 'svg_spatial',
    svgData: {
      gridCells: ['<polygon points="30,40 50,25 70,40 50,55" fill="#690b1b" opacity="0.9" /><polygon points="30,40 50,55 50,80 30,65" fill="#690b1b" opacity="0.6" /><polygon points="70,40 50,55 50,80 70,65" fill="#690b1b" opacity="0.3" />']
    },
    options: [
      { label: 'A', text: 'Cube with light face on top, dark face right, medium face left' },
      { label: 'B', text: 'Cube with medium face on top, light face right, dark face left' },
      { label: 'C', text: 'Cube with identical face shading on all three visible planes' },
      { label: 'D', text: 'Cube with darkest face on top, medium face right, light face left' }
    ],
    correctOption: 'D',
    explanation: 'Rolling the cube 90° right and pitching 90° forward places the darkest shaded face on top, medium shaded face on the right, and light face on the left.'
  },

  // Q20 (Correct: A)
  {
    id: 20,
    section: 2,
    sectionName: 'Spatial / Figure Reasoning',
    category: 'spatial_figure',
    difficulty: 'hard',
    difficultyWeight: 1.8,
    prompt: 'Determine which option shows the correct figure after 45° clockwise rotation.',
    questionType: 'svg_spatial',
    svgData: {
      gridCells: ['<rect x="30" y="30" width="40" height="40" fill="none" stroke="#690b1b" stroke-width="5" transform="rotate(45 50 50)" />']
    },
    options: [
      { label: 'A', text: 'Scaled upright square frame', svgContent: '<rect x="25" y="25" width="50" height="50" fill="none" stroke="#690b1b" stroke-width="5" />' },
      { label: 'B', text: 'Smaller diamond frame', svgContent: '<rect x="35" y="35" width="30" height="30" fill="none" stroke="#690b1b" stroke-width="5" transform="rotate(45 50 50)" />' },
      { label: 'C', text: 'Circle outline', svgContent: '<circle cx="50" cy="50" r="30" fill="none" stroke="#690b1b" stroke-width="5" />' },
      { label: 'D', text: 'Solid square', svgContent: '<rect x="30" y="30" width="40" height="40" fill="#690b1b" />' }
    ],
    correctOption: 'A',
    explanation: 'Rotating a 45° tilted diamond by 45° clockwise realigns its edges parallel to the coordinate axes, forming an upright square.'
  },

  // Q21 (Correct: B)
  {
    id: 21,
    section: 2,
    sectionName: 'Spatial / Figure Reasoning',
    category: 'spatial_figure',
    difficulty: 'hard',
    difficultyWeight: 2.0,
    prompt: 'Which complex figure cannot be formed by rotating the master template in 2D space?',
    questionType: 'svg_spatial',
    svgData: {
      gridCells: ['<path d="M30 30 L70 30 L70 50 L50 50 L50 70 L30 70 Z" fill="#690b1b" />']
    },
    options: [
      { label: 'A', text: 'Figure rotated 90° clockwise' },
      { label: 'B', text: 'Figure requiring 3D chiral reflection (mirror flip)' },
      { label: 'C', text: 'Figure rotated 180°' },
      { label: 'D', text: 'Figure rotated 270° clockwise' }
    ],
    correctOption: 'B',
    explanation: 'Option B is a chiral mirror image of the master template, which requires a 3D reflection out of the 2D plane and cannot be produced by 2D in-plane rotation alone.'
  },

  // =========================================================================
  // SECTION 3: NUMERICAL & QUANTITATIVE REASONING (8 Questions: Q22 - Q29)
  // =========================================================================

  // Q22 (Correct: C)
  {
    id: 22,
    section: 3,
    sectionName: 'Numerical & Quantitative Reasoning',
    category: 'numerical_quantitative',
    difficulty: 'easy',
    difficultyWeight: 1.0,
    prompt: 'Identify the next number in the sequence: 3, 7, 13, 21, 31, ?',
    questionType: 'numeric_pattern',
    options: [
      { label: 'A', text: '39' },
      { label: 'B', text: '41' },
      { label: 'C', text: '43' },
      { label: 'D', text: '45' }
    ],
    correctOption: 'C',
    explanation: 'The differences between consecutive terms increase by +2: +4, +6, +8, +10, so the next difference is +12. 31 + 12 = 43.'
  },

  // Q23 (Correct: D)
  {
    id: 23,
    section: 3,
    sectionName: 'Numerical & Quantitative Reasoning',
    category: 'numerical_quantitative',
    difficulty: 'easy',
    difficultyWeight: 1.0,
    prompt: 'If 4 identical automated processors complete 24 data batches in 6 hours, how many batches can 6 processors complete in 8 hours?',
    questionType: 'text',
    options: [
      { label: 'A', text: '36 batches' },
      { label: 'B', text: '54 batches' },
      { label: 'C', text: '60 batches' },
      { label: 'D', text: '48 batches' }
    ],
    correctOption: 'D',
    explanation: 'One processor rate = 24 batches / (4 processors * 6 hours) = 1 batch per processor-hour. Total batches for 6 processors in 8 hours = 1 * 6 * 8 = 48 batches.'
  },

  // Q24 (Correct: A)
  {
    id: 24,
    section: 3,
    sectionName: 'Numerical & Quantitative Reasoning',
    category: 'numerical_quantitative',
    difficulty: 'easy_medium',
    difficultyWeight: 1.1,
    prompt: 'Determine the missing number in the grid: \nRow 1: [4, 5, 41] (4² + 5² = 41)\nRow 2: [3, 6, 45] (3² + 6² = 45)\nRow 3: [7, 2, ?]',
    questionType: 'numeric_pattern',
    options: [
      { label: 'A', text: '53' },
      { label: 'B', text: '49' },
      { label: 'C', text: '51' },
      { label: 'D', text: '55' }
    ],
    correctOption: 'A',
    explanation: 'The third number in each row equals the sum of the squares of the first two numbers: 7² + 2² = 49 + 4 = 53.'
  },

  // Q25 (Correct: B)
  {
    id: 25,
    section: 3,
    sectionName: 'Numerical & Quantitative Reasoning',
    category: 'numerical_quantitative',
    difficulty: 'medium',
    difficultyWeight: 1.3,
    prompt: 'Solve for X: 2^(X + 3) - 2^X = 56.',
    questionType: 'text',
    options: [
      { label: 'A', text: 'X = 4' },
      { label: 'B', text: 'X = 3' },
      { label: 'C', text: 'X = 2' },
      { label: 'D', text: 'X = 5' }
    ],
    correctOption: 'B',
    explanation: 'Factor out 2^X: 2^X * (2^3 - 1) = 56 => 2^X * 7 = 56 => 2^X = 8 => X = 3.'
  },

  // Q26 (Correct: C)
  {
    id: 26,
    section: 3,
    sectionName: 'Numerical & Quantitative Reasoning',
    category: 'numerical_quantitative',
    difficulty: 'medium',
    difficultyWeight: 1.3,
    prompt: 'What is the next number in this recursive series: 2, 3, 6, 18, 108, ?',
    questionType: 'numeric_pattern',
    options: [
      { label: 'A', text: '1296' },
      { label: 'B', text: '2160' },
      { label: 'C', text: '1944' },
      { label: 'D', text: '1728' }
    ],
    correctOption: 'C',
    explanation: 'Each term is the product of the two preceding terms: 2*3=6, 3*6=18, 6*18=108. The next term is 18 * 108 = 1944.'
  },

  // Q27 (Correct: D)
  {
    id: 27,
    section: 3,
    sectionName: 'Numerical & Quantitative Reasoning',
    category: 'numerical_quantitative',
    difficulty: 'medium_hard',
    difficultyWeight: 1.5,
    prompt: 'A secure container has 6 gold tokens and 4 silver tokens. If 2 tokens are drawn at random without replacement, what is the probability that both tokens are gold?',
    questionType: 'text',
    options: [
      { label: 'A', text: '2/5 (40.0%)' },
      { label: 'B', text: '1/2 (50.0%)' },
      { label: 'C', text: '7/15 (46.7%)' },
      { label: 'D', text: '1/3 (33.3%)' }
    ],
    correctOption: 'D',
    explanation: 'Probability = (6/10) * (5/9) = 30 / 90 = 1/3.'
  },

  // Q28 (Correct: A)
  {
    id: 28,
    section: 3,
    sectionName: 'Numerical & Quantitative Reasoning',
    category: 'numerical_quantitative',
    difficulty: 'hard',
    difficultyWeight: 1.8,
    prompt: 'Find the 8th term of the geometric sequence: 3, -6, 12, -24, 48, ...',
    questionType: 'numeric_pattern',
    options: [
      { label: 'A', text: '-384' },
      { label: 'B', text: '384' },
      { label: 'C', text: '-192' },
      { label: 'D', text: '768' }
    ],
    correctOption: 'A',
    explanation: 'The initial term a = 3 and common ratio r = -2. The 8th term T8 = a * r^(8-1) = 3 * (-2)^7 = 3 * (-128) = -384.'
  },

  // Q29 (Correct: B)
  {
    id: 29,
    section: 3,
    sectionName: 'Numerical & Quantitative Reasoning',
    category: 'numerical_quantitative',
    difficulty: 'hard',
    difficultyWeight: 2.0,
    prompt: 'Solve for the missing value N: N³ - N² = 180.',
    questionType: 'numeric_pattern',
    options: [
      { label: 'A', text: 'N = 5' },
      { label: 'B', text: 'N = 6' },
      { label: 'C', text: 'N = 7' },
      { label: 'D', text: 'N = 8' }
    ],
    correctOption: 'B',
    explanation: 'Test N = 6: 6³ - 6² = 216 - 36 = 180.'
  },

  // =========================================================================
  // SECTION 4: LOGICAL & VERBAL REASONING (8 Questions: Q30 - Q37)
  // =========================================================================

  // Q30 (Correct: C)
  {
    id: 30,
    section: 4,
    sectionName: 'Logical & Verbal Reasoning',
    category: 'logical_verbal',
    difficulty: 'easy',
    difficultyWeight: 1.0,
    prompt: 'Premise 1: All research analysts are data literate.\nPremise 2: Some software engineers are research analysts.\nConclusion:',
    questionType: 'text',
    options: [
      { label: 'A', text: 'All software engineers are data literate.' },
      { label: 'B', text: 'No research analysts are software engineers.' },
      { label: 'C', text: 'Some software engineers are data literate.' },
      { label: 'D', text: 'All data literate individuals are software engineers.' }
    ],
    correctOption: 'C',
    explanation: 'The subset of software engineers who are research analysts must also possess data literacy. Thus, "Some software engineers are data literate" validly follows.'
  },

  // Q31 (Correct: D)
  {
    id: 31,
    section: 4,
    sectionName: 'Logical & Verbal Reasoning',
    category: 'logical_verbal',
    difficulty: 'easy',
    difficultyWeight: 1.0,
    prompt: 'You are running in a marathon race and pass the person currently in second place. What position are you in now?',
    questionType: 'text',
    options: [
      { label: 'A', text: '1st place' },
      { label: 'B', text: '3rd place' },
      { label: 'C', text: '4th place' },
      { label: 'D', text: '2nd place' }
    ],
    correctOption: 'D',
    explanation: 'Passing the runner in 2nd place means you take over their spot in 2nd place (the 1st place runner remains ahead of you).'
  },

  // Q32 (Correct: A)
  {
    id: 32,
    section: 4,
    sectionName: 'Logical & Verbal Reasoning',
    category: 'logical_verbal',
    difficulty: 'easy_medium',
    difficultyWeight: 1.1,
    prompt: 'EPHEMERAL is to PERMANENT as LATENT is to ?',
    questionType: 'text',
    options: [
      { label: 'A', text: 'MANIFEST (or Overt)' },
      { label: 'B', text: 'DORMANT' },
      { label: 'C', text: 'HIDDEN' },
      { label: 'D', text: 'CONCEALED' }
    ],
    correctOption: 'A',
    explanation: 'Ephemeral (short-lived) is an antonym of Permanent. Latent (hidden/dormant) is an antonym of Manifest (evident/visible).'
  },

  // Q33 (Correct: B)
  {
    id: 33,
    section: 4,
    sectionName: 'Logical & Verbal Reasoning',
    category: 'logical_verbal',
    difficulty: 'medium',
    difficultyWeight: 1.3,
    prompt: 'Four colleagues A, B, C, and D are sitting around a circular table facing center. A sits directly opposite C. B sits to the immediate right of A. Who sits to the immediate left of C?',
    questionType: 'text',
    options: [
      { label: 'A', text: 'D' },
      { label: 'B', text: 'B' },
      { label: 'C', text: 'A' },
      { label: 'D', text: 'Cannot be determined' }
    ],
    correctOption: 'B',
    explanation: 'Place A at South (facing North/center). C sits opposite A at North (facing South). B sits to the immediate right of A (East side). D sits at West side. Looking from C at North facing South, C left side points East where B sits. Thus B sits to the immediate left of C.'
  },

  // Q34 (Correct: C)
  {
    id: 34,
    section: 4,
    sectionName: 'Logical & Verbal Reasoning',
    category: 'logical_verbal',
    difficulty: 'medium',
    difficultyWeight: 1.3,
    prompt: 'If the term "LOGIC" is encoded as "NQIKE" (+2 shift), how is "BRAIN" encoded under the exact same transformation rule?',
    questionType: 'text',
    options: [
      { label: 'A', text: 'CSBJO' },
      { label: 'B', text: 'DTCKO' },
      { label: 'C', text: 'DTCKP' },
      { label: 'D', text: 'EUDLQ' }
    ],
    correctOption: 'C',
    explanation: 'Shift each letter forward by 2 positions in the alphabet: B(+2)->D, R(+2)->T, A(+2)->C, I(+2)->K, N(+2)->P = DTCKP.'
  },

  // Q35 (Correct: D)
  {
    id: 35,
    section: 4,
    sectionName: 'Logical & Verbal Reasoning',
    category: 'logical_verbal',
    difficulty: 'medium_hard',
    difficultyWeight: 1.5,
    prompt: 'Person X states: "At least one of us is a liar." Person Y remains silent. Knights always tell the truth; Knaves always lie. What are X and Y?',
    questionType: 'text',
    options: [
      { label: 'A', text: 'Both X and Y are Knights' },
      { label: 'B', text: 'Both X and Y are Knaves' },
      { label: 'C', text: 'X is a Knave, Y is a Knight' },
      { label: 'D', text: 'X is a Knight, Y is a Knave' }
    ],
    correctOption: 'D',
    explanation: 'If X were a Knave (liar), X\'s claim would be true, which is impossible for a liar. Therefore X must be a Knight (truth-teller). Since X speaks the truth, at least one is a liar, which means Y must be the Knave.'
  },

  // Q36 (Correct: A)
  {
    id: 36,
    section: 4,
    sectionName: 'Logical & Verbal Reasoning',
    category: 'logical_verbal',
    difficulty: 'hard',
    difficultyWeight: 1.8,
    prompt: 'Statement: "Adopting automated cognitive testing reduces evaluation lead time by 75%." Which implicit assumption must hold true for this statement to be valid?',
    questionType: 'text',
    options: [
      { label: 'A', text: 'Lead time in cognitive testing is primarily consumed by manual scoring and administration.' },
      { label: 'B', text: 'Automated testing eliminates all human evaluation entirely.' },
      { label: 'C', text: 'Students perform better on automated cognitive assessments than paper tests.' },
      { label: 'D', text: 'Manual evaluation is completely inaccurate.' }
    ],
    correctOption: 'A',
    explanation: 'For automation to reduce lead time by 75%, manual scoring and administration must account for the vast majority of original evaluation duration.'
  },

  // Q37 (Correct: B)
  {
    id: 37,
    section: 4,
    sectionName: 'Logical & Verbal Reasoning',
    category: 'logical_verbal',
    difficulty: 'hard',
    difficultyWeight: 2.0,
    prompt: 'A company increased training hours per employee, yet overall project error rates rose. Which option best resolves this apparent paradox?',
    questionType: 'text',
    options: [
      { label: 'A', text: 'Employees appreciated the extra training hours.' },
      { label: 'B', text: 'The training introduced complex new software tools that staff were unaccustomed to using during initial execution.' },
      { label: 'C', text: 'The company hired additional quality assurance personnel.' },
      { label: 'D', text: 'Error rates are measured monthly.' }
    ],
    correctOption: 'B',
    explanation: 'Introducing unfamiliar, complex new tools during training explains why error rates temporarily spiked during early operational implementation despite the extra training hours.'
  },

  // =========================================================================
  // SECTION 5: SEQUENCE, WORKING MEMORY & ABSTRACT REASONING (8 Questions: Q38 - Q45)
  // =========================================================================

  // Q38 (Correct: C)
  {
    id: 38,
    section: 5,
    sectionName: 'Sequence, Working Memory & Abstract Reasoning',
    category: 'sequence_abstract',
    difficulty: 'easy',
    difficultyWeight: 1.0,
    prompt: 'Determine the missing symbol in the repeating sequence: ▲, ■, ●, ▲, ■, ●, ▲, ?',
    questionType: 'svg_sequence',
    svgData: {
      gridCells: [
        '<polygon points="50,15 85,85 15,85" fill="#690b1b" />',
        '<rect x="20" y="20" width="60" height="60" fill="#690b1b" />',
        '<circle cx="50" cy="50" r="30" fill="#690b1b" />',
        '?'
      ]
    },
    options: [
      { label: 'A', text: 'Solid circle (●)', svgContent: '<circle cx="50" cy="50" r="30" fill="#690b1b" />' },
      { label: 'B', text: 'Solid triangle (▲)', svgContent: '<polygon points="50,15 85,85 15,85" fill="#690b1b" />' },
      { label: 'C', text: 'Solid square (■)', svgContent: '<rect x="20" y="20" width="60" height="60" fill="#690b1b" />' },
      { label: 'D', text: 'Horizontal bar', svgContent: '<line x1="10" y1="50" x2="90" y2="50" stroke="#690b1b" stroke-width="6" />' }
    ],
    correctOption: 'C',
    explanation: 'The sequence repeats the 3-element pattern (Triangle -> Square -> Circle). Following Triangle comes Square.'
  },

  // Q39 (Correct: D)
  {
    id: 39,
    section: 5,
    sectionName: 'Sequence, Working Memory & Abstract Reasoning',
    category: 'sequence_abstract',
    difficulty: 'easy_medium',
    difficultyWeight: 1.1,
    prompt: 'Which grid configuration matches a 180-degree rotation of the memory tile layout?',
    questionType: 'svg_spatial',
    svgData: {
      gridCells: ['<rect x="15" y="15" width="30" height="30" fill="#690b1b" /><rect x="55" y="55" width="30" height="30" fill="#690b1b" />']
    },
    options: [
      { label: 'A', text: 'Bottom-left and top-right filled blocks', svgContent: '<rect x="15" y="55" width="30" height="30" fill="#690b1b" /><rect x="55" y="15" width="30" height="30" fill="#690b1b" />' },
      { label: 'B', text: 'Central circle', svgContent: '<circle cx="50" cy="50" r="30" fill="#690b1b" />' },
      { label: 'C', text: 'Central square', svgContent: '<rect x="25" y="25" width="50" height="50" fill="#690b1b" />' },
      { label: 'D', text: 'Top-left and bottom-right filled blocks (identical 180° symmetry)', svgContent: '<rect x="55" y="55" width="30" height="30" fill="#690b1b" /><rect x="15" y="15" width="30" height="30" fill="#690b1b" />' }
    ],
    correctOption: 'D',
    explanation: 'Rotating the main-diagonal (top-left + bottom-right) block pair by 180 degrees maps top-left to bottom-right and bottom-right to top-left, preserving diagonal symmetry.'
  },

  // Q40 (Correct: A)
  {
    id: 40,
    section: 5,
    sectionName: 'Sequence, Working Memory & Abstract Reasoning',
    category: 'sequence_abstract',
    difficulty: 'medium',
    difficultyWeight: 1.3,
    prompt: 'Symbol * doubles the input value; Symbol # adds 3. What is the output of 4 * # * ?',
    questionType: 'text',
    options: [
      { label: 'A', text: '22' },
      { label: 'B', text: '20' },
      { label: 'C', text: '26' },
      { label: 'D', text: '18' }
    ],
    correctOption: 'A',
    explanation: 'Start with 4. Apply *: 4 * 2 = 8. Apply #: 8 + 3 = 11. Apply *: 11 * 2 = 22.'
  },

  // Q41 (Correct: B)
  {
    id: 41,
    section: 5,
    sectionName: 'Sequence, Working Memory & Abstract Reasoning',
    category: 'sequence_abstract',
    difficulty: 'medium',
    difficultyWeight: 1.3,
    prompt: 'Which shape sequence displays progressive side addition (+1 side per step)?',
    questionType: 'text',
    options: [
      { label: 'A', text: 'Circle (1) → Triangle (3) → Square (4) → Octagon (8)' },
      { label: 'B', text: 'Triangle (3) → Square (4) → Pentagon (5) → Hexagon (6)' },
      { label: 'C', text: 'Square (4) → Hexagon (6) → Octagon (8)' },
      { label: 'D', text: 'Triangle (3) → Pentagon (5) → Heptagon (7)' }
    ],
    correctOption: 'B',
    explanation: 'Option B strictly follows the +1 polygon side increment rule: 3 sides -> 4 sides -> 5 sides -> 6 sides.'
  },

  // Q42 (Correct: C)
  {
    id: 42,
    section: 5,
    sectionName: 'Sequence, Working Memory & Abstract Reasoning',
    category: 'sequence_abstract',
    difficulty: 'medium_hard',
    difficultyWeight: 1.5,
    prompt: 'Memorize the alphanumeric key sequence: [K, 4, M, 9, R]. Which option represents the exact reverse of this sequence?',
    questionType: 'text',
    options: [
      { label: 'A', text: 'R, M, 9, 4, K' },
      { label: 'B', text: 'K, 9, M, 4, R' },
      { label: 'C', text: 'R, 9, M, 4, K' },
      { label: 'D', text: 'R, 4, M, 9, K' }
    ],
    correctOption: 'C',
    explanation: 'Reversing [K, 4, M, 9, R] item by item produces [R, 9, M, 4, K].'
  },

  // Q43 (Correct: D)
  {
    id: 43,
    section: 5,
    sectionName: 'Sequence, Working Memory & Abstract Reasoning',
    category: 'sequence_abstract',
    difficulty: 'hard',
    difficultyWeight: 1.8,
    prompt: 'Rule X inverts color; Rule Y rotates 90° clockwise. If an upright white arrow undergoes transformation [X → Y → X], what is the final state?',
    questionType: 'text',
    options: [
      { label: 'A', text: 'Upright white arrow' },
      { label: 'B', text: 'Right-pointing dark arrow' },
      { label: 'C', text: 'Down-pointing dark arrow' },
      { label: 'D', text: 'Right-pointing white arrow' }
    ],
    correctOption: 'D',
    explanation: 'Start: Upright white. X (color invert) -> Upright dark. Y (rotate 90° CW) -> Right-pointing dark. X (color invert) -> Right-pointing white.'
  },

  // Q44 (Correct: A)
  {
    id: 44,
    section: 5,
    sectionName: 'Sequence, Working Memory & Abstract Reasoning',
    category: 'sequence_abstract',
    difficulty: 'hard',
    difficultyWeight: 1.8,
    prompt: 'Which set of geometric figures obeys both Rule 1 (Inner dot shifts clockwise) and Rule 2 (Outer frame alternates shape)?',
    questionType: 'text',
    options: [
      { label: 'A', text: 'Square with top-left dot → Circle with top-right dot → Square with bottom-right dot → Circle with bottom-left dot' },
      { label: 'B', text: 'Square with top-left dot → Square with top-right dot → Square with bottom-right dot' },
      { label: 'C', text: 'Circle with center dot → Circle with top dot → Circle with right dot' },
      { label: 'D', text: 'Triangle with left dot → Triangle with right dot' }
    ],
    correctOption: 'A',
    explanation: 'Option A alternates outer frame geometry (Square -> Circle -> Square -> Circle) while shifting the dot position clockwise around corners (TL -> TR -> BR -> BL).'
  },

  // Q45 (Correct: B)
  {
    id: 45,
    section: 5,
    sectionName: 'Sequence, Working Memory & Abstract Reasoning',
    category: 'sequence_abstract',
    difficulty: 'hard',
    difficultyWeight: 2.0,
    prompt: 'Final Assessment Item: Determine which master rule governs the 45-item cognitive progression.',
    questionType: 'text',
    options: [
      { label: 'A', text: 'Random number generation without structural validity' },
      { label: 'B', text: 'Multidimensional cognitive scaling across visual, spatial, quantitative, logical, and abstract reasoning domains' },
      { label: 'C', text: 'Simple memory recall of elementary arithmetic' },
      { label: 'D', text: 'Unstructured speed typing' }
    ],
    correctOption: 'B',
    explanation: 'The 45-question standardized cognitive assessment measures multidimensional intelligence across visual matrix reasoning, spatial transformation, quantitative logic, verbal deduction, and abstract working memory.'
  }
];
