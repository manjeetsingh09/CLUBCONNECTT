import ReactGA from 'react-ga4';

/**
 * Reusable function to fire custom GA4 events
 * @param {string} category - The overarching bucket (e.g., 'Gamification', 'Assessment')
 * @param {string} action - The specific interaction (e.g., 'Level Up', 'Test Started')
 * @param {string} label - Optional context (e.g., 'College Coordinator', 'JECRC')
 * @param {number} value - Optional numerical metric (e.g., XP gained, Test Score)
 */
export const trackEvent = (category, action, label = null, value = null) => {
  const eventParams = { category, action };
  if (label) eventParams.label = label;
  if (value !== null) eventParams.value = value;
  
  ReactGA.event(eventParams);
};
