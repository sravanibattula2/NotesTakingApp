import styled from '@emotion/styled';
import Notepad from './Notepad';

function App() {
    // Websocket setup
    const SOCKET_URL = `ws://localhost:8000/ws/socket-server/`;
    const commentSocket: WebSocket = new WebSocket(SOCKET_URL);
    return (
        <Container>
            <Notepad commentSocket={commentSocket} />
        </Container>
    );
}

export default App;

const Container = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e0e3e7;
`;
