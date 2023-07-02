import { CommentType } from './interfaces';
import Quill from 'quill';
import styled from '@emotion/styled';

type CommentProps = {
    comment: CommentType;
    quill: Quill | null;
};

export default function Comment({ comment, quill }: CommentProps) {
    function handleCommentClick() {
        if (!quill) return;

        quill.removeFormat(0, quill.getText().length);
        quill.formatText(comment.startIndex, comment.length, {
            background: 'rgba(252, 240, 3, 0.6)',
        });
    }

    return (
        <CommentWrapper onClick={handleCommentClick}>
            <Text>{comment.text}</Text>
        </CommentWrapper>
    );
}

const Text = styled.div`
    color: black;
    font-size: 14px;
`;

const CommentWrapper = styled.div`
    cursor: pointer;
    margin: 12px 0px;
    min-height: 50px;
    max-width: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f5f5f5;
    padding: 16px;
    box-sizing: border-box;
    border-radius: 4px;
`;
