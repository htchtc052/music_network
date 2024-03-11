export type RegisterData = {
  username: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export enum Genders {
  MALE = "MALE",
  FEMALE = "FEMALE",
  NOT_SPECIFIED = "NOT_SPECIFIED",
}

export type User = {
  id: number;
  username: string;
  email: string;
  gender: Genders;
  firstName: string;
  lastName: string;
  createdAt: Date;
};

export type AuthUserData = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export type TokensData = {
  accessToken: string | null;
  refreshToken: string | null;
};

export type Page = {
  id: number;
  userId: number;
  title: string;
  slug: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreatePageInput = {
  title: string;
  slug: string;
  description?: string;
};

export type TrackFile = {
  fileSize: number;
  filePath: string;
  mimetype: string;
};

export type Track = {
  id: number;
  userId: number;
  pageId: number;
  title: string;
  description: string;
  hiddenDescription: string;
  keywords: string[];
  createdAt: Date;
  updatedAt: Date;
  trackFile: TrackFile;
};

export type EditTrackInfoInput = {
  title: string;
  slug: string;
  description?: string;
};
