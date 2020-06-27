import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
} from '@material-ui/core'

interface Props {
    isOpen: boolean
    onJoin: () => void
    onCancel: () => void
}

const JoinGameDialog: React.FC<Props> = ({
    isOpen,
    onJoin,
    onCancel,
}) => (
    <Dialog
        open={isOpen}
        onClose={onCancel}
    >
        <DialogContent>
            You are already in a game. Would you like to leave current game and join this one?
        </DialogContent>
        <DialogActions>
            <Button onClick={onCancel}>
                Cancel
            </Button>
            <Button onClick={onJoin}>
                Join game
            </Button>
        </DialogActions>

    </Dialog>
)



export default JoinGameDialog
