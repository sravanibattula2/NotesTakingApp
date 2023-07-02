import { useEffect, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import CommentList from './CommentList';
import styled from '@emotion/styled';
import { Typography, Divider } from '@mui/material';
import { ClickAwayListener } from '@mui/base';

import AddComment from './AddComment';
import { CommentType } from './interfaces';

export default function TextEditor({
    commentSocket,
}: {
    commentSocket: WebSocket;
}) {
    const [quill, setQuill] = useState<Quill | null>(null);
    const [addingComment, setAddingComment] = useState<boolean>(false);
    const [commentList, setCommentList] = useState<CommentType[]>([]);

    commentSocket.onmessage = (e) => {
        const data = JSON.parse(e.data);

        if (data.type === 'comment-list') {
            console.log('comment-list');
            const newCommentList: CommentType[] = JSON.parse(data.message);
            setCommentList(newCommentList);
        }
    };

    useEffect(() => {
        async function loadQuill() {
            const editor = new Quill('#quill-pad', {
                theme: 'snow',
                modules: {
                    toolbar: false,
                },
                readOnly: true,
            });
            var str: string =
                "Xu Wang\n\n\nXu Wang is an Assistant Professor in Computer Science and Engineering at the University of Michigan. Xu develops and advances human-AI collaborative techniques to support education. One of her research goals is to empower instructors and educators to create effective learning experiences more easily, which in turn supports scalable teaching and learning. An example is providing instructors with on-demand controllable AI assistance while they are designing quiz questions. In addition, Xu also studies ways to help people be more attentive to each other's ideas during collaboration, and develops Augmented Reality-based systems to support physical task learning, e.g. in medical contexts. Xu completed her Ph.D. in the Human-Computer Interaction Institute in the School of Computer Science at Carnegie Mellon University. Her Ph.D. dissertation explores techniques using student solutions to semi-automatically generate authentic questions for deblierate practice of higher-order thinking. Her work has been published at many top-tier conferences and journals in Human-Computer Interaction and Educational Technologies. She received a Masters in Education from Harvard Graduate School of Education and a Bachelor’s in Science from Beijing Normal University. She has also worked in the User Interface Research Group at Autodesk Research.";
            editor.setText(str);
            setQuill(editor);
        }

        loadQuill();
    }, []);

    return (
        <ClickAwayListener
            onClickAway={() =>
                quill && quill.removeFormat(0, quill.getText().length)
            }
        >
            <Container>
                <QuillPad id="quill-pad" />
                <Comments>
                    <Typography variant="h4">Comments</Typography>
                    <Divider />
                    {quill && (
                        <AddComment
                            quill={quill}
                            addingComment={addingComment}
                            setAddingComment={setAddingComment}
                            commentSocket={commentSocket}
                        />
                    )}
                    <CommentList commentlist={commentList} quill={quill} />
                </Comments>
            </Container>
        </ClickAwayListener>
    );
}

const Container = styled.div`
    padding: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: flex-start;
`;

const Comments = styled.div`
    height: 90vh;
    margin-top: 25px;
`;

const QuillPad = styled.div`
    width: 8.5in;
    height: 90vh;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
    background-color: white;
    margin: 25px;
`;

// color to add towards time stamp or character count :#1976d2
