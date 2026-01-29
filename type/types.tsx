export type DeviceType = "mobile" | "website";

export type ProjectType = {
    id: string;
    projectId: string;
    userInput: string;
    device: DeviceType;
    userId: string;
    projectName: string;
    theme: string;
    createdAt: Date;
    updatedAt: Date;
}

export type ScreenConfigType = {
    id: string;
    projectId: string;
    screenId: string;
    screenName: string;
    purpose: string;
    screenDescription: string;
    designIntent: string;
    createdAt: Date;
    updatedAt: Date;
}