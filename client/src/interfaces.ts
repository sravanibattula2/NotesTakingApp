export interface CommentType extends Range {
    id: number;
    text: string;
}

export type CommentListType = CommentType[];

export interface Range {
    startIndex: number;
    length: number;
}
