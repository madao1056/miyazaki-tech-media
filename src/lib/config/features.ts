export const FEATURES = {
  // Phase 1 (公開)
  AUTH: true,
  BOOKMARKS: true,
  AUTHOR_FOLLOW: true,
  READING_HISTORY: true,
  PERSONALIZED_FEED: true,

  // Phase 2 (非表示)
  COMMENTS: false,
  LIKES: false,
  SHARE_TRACKING: false,
  NOTIFICATIONS: false,
} as const;

export type FeatureFlag = keyof typeof FEATURES;

export const isFeatureEnabled = (feature: FeatureFlag): boolean => {
  return FEATURES[feature];
};
