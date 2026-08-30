import { QUESTION_BANK_45, type IQQuestion45 } from './iq-questions-45';

export interface IQValidationResult {
  totalQuestions: number;
  validQuestions: number;
  invalidQuestions: number;
  missingAssets: number;
  invalidCorrectAnswers: number;
  duplicateQuestionIds: number;
  duplicateOptions: number;
  missingSections: number;
  missingDifficulty: number;
  errors: string[];
}

export function validateIQQuestionBank(): IQValidationResult {
  const errors: string[] = [];
  const idSet = new Set<number>();
  let duplicateQuestionIds = 0;
  let invalidCorrectAnswers = 0;
  let missingAssets = 0;
  let duplicateOptions = 0;
  let missingSections = 0;
  let missingDifficulty = 0;
  let validCount = 0;

  const validSections = new Set([1, 2, 3, 4, 5]);

  QUESTION_BANK_45.forEach((q, idx) => {
    let qValid = true;
    const qLabel = `Q${q.id || idx + 1}`;

    // 1. Validate ID
    if (!q.id || typeof q.id !== 'number') {
      errors.push(`${qLabel}: Invalid or missing question ID`);
      qValid = false;
    } else if (idSet.has(q.id)) {
      duplicateQuestionIds++;
      errors.push(`${qLabel}: Duplicate question ID ${q.id}`);
      qValid = false;
    } else {
      idSet.add(q.id);
    }

    // 2. Validate Section
    if (!validSections.has(q.section)) {
      missingSections++;
      errors.push(`${qLabel}: Invalid section ${q.section}`);
      qValid = false;
    }

    // 3. Validate Difficulty & Weight
    if (!q.difficulty || !q.difficultyWeight || q.difficultyWeight <= 0) {
      missingDifficulty++;
      errors.push(`${qLabel}: Missing or invalid difficulty rating/weight`);
      qValid = false;
    }

    // 4. Validate Correct Option
    if (!['A', 'B', 'C', 'D'].includes(q.correctOption)) {
      invalidCorrectAnswers++;
      errors.push(`${qLabel}: Invalid correctOption '${q.correctOption}'`);
      qValid = false;
    }

    // 5. Validate Options
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      errors.push(`${qLabel}: Must have exactly 4 options`);
      qValid = false;
    } else {
      const labels = new Set<string>();
      q.options.forEach((opt, oIdx) => {
        if (!opt.label || labels.has(opt.label)) {
          duplicateOptions++;
          errors.push(`${qLabel}: Duplicate option label '${opt.label}' at index ${oIdx}`);
          qValid = false;
        }
        labels.add(opt.label);
      });
    }

    // 6. Validate Visual Assets if question uses SVG
    const isVisualType = ['svg_matrix', 'svg_sequence', 'svg_analogy', 'svg_spatial'].includes(q.questionType);
    if (isVisualType) {
      if (!q.svgData || (!Array.isArray(q.svgData.gridCells) && !Array.isArray(q.svgData.options))) {
        missingAssets++;
        errors.push(`${qLabel}: Missing visual svgData or gridCells for visual questionType '${q.questionType}'`);
        qValid = false;
      } else if (q.svgData.gridCells && q.svgData.gridCells.length === 0) {
        missingAssets++;
        errors.push(`${qLabel}: Empty gridCells array for visual questionType '${q.questionType}'`);
        qValid = false;
      }
    }

    if (qValid) {
      validCount++;
    }
  });

  const summary: IQValidationResult = {
    totalQuestions: QUESTION_BANK_45.length,
    validQuestions: validCount,
    invalidQuestions: QUESTION_BANK_45.length - validCount,
    missingAssets,
    invalidCorrectAnswers,
    duplicateQuestionIds,
    duplicateOptions,
    missingSections,
    missingDifficulty,
    errors
  };

  console.log(`[IQ QUESTION VALIDATION] total=${summary.totalQuestions} valid=${summary.validQuestions} invalid=${summary.invalidQuestions}`);
  if (summary.errors.length > 0) {
    console.warn(`[IQ QUESTION VALIDATION ERRORS]:`, summary.errors);
  }

  return summary;
}
