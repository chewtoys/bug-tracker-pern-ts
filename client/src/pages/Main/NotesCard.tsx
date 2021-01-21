import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthState } from '../../redux/slices/authSlice';
import { selectProjectById } from '../../redux/slices/projectsSlice';
import { deleteNote } from '../../redux/slices/bugsSlice';
import { Note } from '../../redux/types';
import { RootState } from '../../redux/store';
import SortBar from '../../components/SortBar';
import sortNotes from '../../utils/sortNotes';
import NoteForm from './NoteForm';
import ConfirmDialog from '../../components/ConfirmDialog';
import FormDialog from '../../components/FormDialog';
import { formatTimeAgo } from '../../utils/helperFuncs';

import { Paper, Typography, Avatar, Divider } from '@material-ui/core';
import { useMainPageStyles } from '../../styles/muiStyles';
import ForumOutlinedIcon from '@material-ui/icons/ForumOutlined';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CommentIcon from '@material-ui/icons/Comment';

export type NoteSortValues = 'newest' | 'oldest' | 'updated';

const menuItems = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'updated', label: 'Recently Updated' },
];

const NotesCard: React.FC<{
  notes: Note[];
  projectId: string;
  bugId: string;
}> = ({ notes, projectId, bugId }) => {
  const classes = useMainPageStyles();
  const dispatch = useDispatch();
  const { user } = useSelector(selectAuthState);
  const project = useSelector((state: RootState) =>
    selectProjectById(state, projectId)
  );
  const [sortBy, setSortBy] = useState<NoteSortValues>('newest');

  const handleSortChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setSortBy(e.target.value as NoteSortValues);
  };

  const sortedNotes = sortNotes(notes, sortBy);

  const handleDeleteNote = (noteId: number) => {
    dispatch(deleteNote(projectId, bugId, noteId));
  };

  return (
    <Paper className={classes.notesPaper}>
      <div className={classes.flexInput}>
        <Typography
          variant="h5"
          color="secondary"
          className={classes.flexHeader}
        >
          <ForumOutlinedIcon
            fontSize="large"
            style={{ marginRight: '0.2em' }}
          />
          Notes
        </Typography>
        <div style={{ width: '25%' }}>
          <SortBar
            sortBy={sortBy}
            handleSortChange={handleSortChange}
            menuItems={menuItems}
            label="Notes"
            size="small"
          />
        </div>
      </div>
      <FormDialog
        triggerBtn={{
          type: 'normal',
          text: 'Leave A Note',
          icon: CommentIcon,
          style: { marginTop: '1em' },
        }}
        title="Post a note"
      >
        <NoteForm isEditMode={false} projectId={projectId} bugId={bugId} />
      </FormDialog>
      <div className={classes.notesWrapper}>
        {sortedNotes.map((n) => (
          <div key={n.id}>
            <div className={classes.singleNote}>
              <Avatar className={classes.avatar}>
                {n.author.username.slice(0, 1)}
              </Avatar>
              <div>
                <Typography color="secondary" variant="caption">
                  {n.author.username}
                </Typography>
                <Typography color="secondary" variant="caption">
                  <em> • {formatTimeAgo(n.createdAt)} ago</em>
                </Typography>
                {n.updatedAt !== n.createdAt && (
                  <Typography color="secondary" variant="caption">
                    {' '}
                    • updated <em>{formatTimeAgo(n.updatedAt)} ago</em>
                  </Typography>
                )}
                <Typography
                  color="secondary"
                  variant="subtitle1"
                  className={classes.noteBody}
                >
                  {n.body}
                </Typography>
                <div className={classes.notesBtnWrapper}>
                  {n.author.id === user?.id && (
                    <FormDialog
                      triggerBtn={{
                        type: 'normal',
                        text: 'Edit',
                        icon: EditIcon,
                        variant: 'outlined',
                        size: 'small',
                      }}
                      title="Edit the note"
                    >
                      <NoteForm
                        isEditMode={true}
                        projectId={projectId}
                        bugId={bugId}
                        noteId={n.id}
                        currentBody={n.body}
                      />
                    </FormDialog>
                  )}
                  {(n.author.id === user?.id ||
                    user?.id === project?.createdBy.id) && (
                    <ConfirmDialog
                      title="Confirm Delete Note"
                      contentText="Are you sure you want to delete the note?"
                      actionBtnText="Delete Note"
                      triggerBtn={{
                        type: 'normal',
                        text: 'Delete',
                        icon: DeleteIcon,
                        style: { marginLeft: '1em' },
                        variant: 'outlined',
                        size: 'small',
                      }}
                      actionFunc={() => handleDeleteNote(n.id)}
                    />
                  )}
                </div>
              </div>
            </div>
            <Divider />
          </div>
        ))}
      </div>
    </Paper>
  );
};

export default NotesCard;
