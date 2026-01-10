// Helper to read object's properties as obj['name']
export type ObjectPropByName = Record<string, any>;

/**
 * Data for "Page Link" in SideBar adn other UI elements
 */
export type LinkToPage = {
  icon?: string; // Icon name to use as <AppIcon icon={icon} />
  path?: string; // URL to navigate to
  title?: string; // Title or primary text to display
  subtitle?: string; // Sub-title or secondary text to display
};

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}


export enum BattingStyle {
  RIGHT_HANDED = 'Right-handed',
  LEFT_HANDED = 'Left-handed',
}

export enum BowlingStyle {
  RIGHT_ARM_FAST = 'Right-arm fast',
  LEFT_ARM_FAST = 'Left-arm fast',
  RIGHT_ARM_SPIN = 'Right-arm spin',
  LEFT_ARM_SPIN = 'Left-arm spin',
}

export enum PlayerRole {
  BATSMAN = 'Batsman',
  BOWLER = 'Bowler',
  ALL_ROUNDER = 'All-rounder',
  WICKET_KEEPER = 'Wicket-keeper',
}

export enum Nationality {
  INDIA = 'India',
  AUSTRALIA = 'Australia',
  ENGLAND = 'England',
  PAKISTAN = 'Pakistan',
  SOUTH_AFRICA = 'South Africa',
  NEW_ZEALAND = 'New Zealand',
  WEST_INDIES = 'West Indies',
  SRI_LANKA = 'Sri Lanka',
  BANGLADESH = 'Bangladesh',
  AFGHANISTAN = 'Afghanistan',
}
