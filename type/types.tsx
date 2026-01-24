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