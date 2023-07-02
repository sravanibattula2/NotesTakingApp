import { CommentListType, CommentType } from './interfaces';
import Quill from 'quill';
import styled from '@emotion/styled';
import Comment from './Comment';

type CommentListProps = {
    commentlist: CommentListType;
    quill: Quill | null;
};

export default function CommentList({ commentlist, quill }: CommentListProps) {
    return (
        <Container>
            <ContentWrapper>
                {quill &&
                    commentlist.map((comment: CommentType) => (
                        <Comment
                            key={comment.id}
                            comment={comment}
                            quill={quill}
                        />
                    ))}
            </ContentWrapper>
        </Container>
    );
}

const Container = styled.div`
    margin-top: 16px;
    height: calc(100% - 210px);
    overflow-y: auto;
`;

const ContentWrapper = styled.div``;
