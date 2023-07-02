import { useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import styled from '@emotion/styled';
import { Button, Tooltip, Card, TextField, Box } from '@mui/material';
import { Range } from './interfaces';
import { ClickAwayListener } from '@mui/base';

type AddCommentProps = {
    quill: Quill;
    addingComment: boolean;
    setAddingComment: React.Dispatch<React.SetStateAction<boolean>>;
    commentSocket: WebSocket;
};

export default function AddComment({
    quill,
    addingComment,
    setAddingComment,
    commentSocket,
}: AddCommentProps) {
    const [selection, setSelection] = useState<Range | null>(null);
    const [persistedSelection, setPersistedSelection] = useState<Range | null>(
        null
    );
    const [commentText, setCommentText] = useState<string>('');

    quill.on('selection-change', function (range, oldRange, source) {
        if (range) {
            if (range.length === 0) {
                setSelection(null);
            } else {
                setSelection({ startIndex: range.index, length: range.length });
            }
        } else {
            setSelection(null);
        }
    });

    function handleAddComment() {
        if (!selection) return;
        quill.removeFormat(0, quill.getText().length);
        quill.formatText(selection.startIndex, selection.length, {
            background: 'rgba(252, 240, 3, 0.6)',
        });
        setPersistedSelection(selection);
        quill.setSelection(0, 0);
        setAddingComment(true);
    }

    function handleSaveComment(): void {
        console.log('save comment');
        console.log(persistedSelection);
        console.log(commentText);

        commentSocket.send(
            JSON.stringify({
                type: 'comment',
                data: {
                    startIndex: persistedSelection?.startIndex,
                    length: persistedSelection?.length,
                    text: commentText.trim(),
                },
            })
        );

        setCommentText('');
        quill.removeFormat(0, quill.getText().length);
        setAddingComment(false);
        setPersistedSelection(null);
    }

    return (
        <ClickAwayListener onClickAway={() => setAddingComment(false)}>
            <Container>
                <Card>
                    <Box
                        sx={{
                            p: '15px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                        }}
                    >
                        {addingComment && (
                            <TextField
                                multiline
                                fullWidth
                                minRows={1}
                                inputProps={{ maxLength: 200 }}
                                maxRows={3}
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                id="standard-basic"
                                placeholder="Type here..."
                            />
                        )}
                        {addingComment ? (
                            <SaveCommentButton onClick={handleSaveComment} />
                        ) : selection != null ? (
                            <AddCommentButton
                                disabled={false}
                                onClick={handleAddComment}
                            />
                        ) : (
                            <Tooltip
                                title="Select text to add a comment"
                                arrow
                                placement="top"
                            >
                                <span>
                                    <AddCommentButton disabled={true} />
                                </span>
                            </Tooltip>
                        )}
                    </Box>
                </Card>
            </Container>
        </ClickAwayListener>
    );
}

const AddCommentButton = ({
    onClick,
    disabled,
}: {
    disabled: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) => (
    <Button
        variant="contained"
        disabled={disabled}
        onClick={onClick}
        sx={{
            '&:hover': {
                bgcolor: 'custom.lightGrayishBlue',
            },
        }}
    >
        Add Comment
    </Button>
);

const SaveCommentButton = ({
    onClick,
}: {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) => (
    <Button
        variant="contained"
        onClick={onClick}
        sx={{
            marginTop: '12px',
            '&:hover': {
                bgcolor: 'custom.lightGrayishBlue',
            },
        }}
    >
        Save
    </Button>
);

const Container = styled.div`
    margin-top: 16px;
`;
