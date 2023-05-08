import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import CheckIcon from '@mui/icons-material/Check';
import MergeIcon from '@mui/icons-material/Merge';
import FilterListIcon from '@mui/icons-material/FilterList';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { MouseEvent } from 'react';

interface MyDate {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

const displayDate = (date: MyDate) => {
  if (date === null) {
    return '';
  }
  return `${date.month}/${date.day}/${date.year}`;
};

interface Issue {
  id: number;
  equipmentId: number;
  status: string;
  priority: string;
  description: string;
  dateReported: MyDate;
  dateResolved: MyDate;
  resolutionDetails: string | null;
}

interface TableProps {
  issues: Issue[];
  URL: string;
  getData: () => Promise<void>;
}

const compareDate = (a: MyDate, b: MyDate) => {
  // if both dates are null, they are equal
  if (a === null && b === null) {
    return 0;
  }
  // if one date is null, the other is greater
  if (a === null) {
    return -1;
  }
  if (b === null) {
    return 1;
  }
  if (a.year < b.year) {
    return -1;
  }
  if (a.year > b.year) {
    return 1;
  }
  if (a.month < b.month) {
    return -1;
  }
  if (a.month > b.month) {
    return 1;
  }
  if (a.day < b.day) {
    return -1;
  }
  if (a.day > b.day) {
    return 1;
  }
  if (a.hour < b.hour) {
    return -1;
  }
  if (a.hour > b.hour) {
    return 1;
  }
  if (a.minute < b.minute) {
    return -1;
  }
  if (a.minute > b.minute) {
    return 1;
  }
  return 0;
};

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  // if the values are numbers, compare them directly
  if (typeof a[orderBy] === 'number' && typeof b[orderBy] === 'number') {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
  }
  // if orderBy "status" order in the following way ["CLOSED", "RESOLVED", "IN_PROGRESS", "NEW"]
  if (orderBy === 'status') {
    const statusOrder = ['CLOSED', 'RESOLVED', 'IN_PROGRESS', 'NEW'];
    if (statusOrder.indexOf(String(b[orderBy])) < statusOrder.indexOf(String(a[orderBy]))) {
      return -1;
    }
    if (statusOrder.indexOf(String(b[orderBy])) > statusOrder.indexOf(String(a[orderBy]))) {
      return 1;
    }
  }
  // if orderBy "priority" order in the following way ["LOW", "MEDIUM", "HIGH", "URGENT"]
  if (orderBy === 'priority') {
    const priorityOrder = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
    if (priorityOrder.indexOf(String(b[orderBy])) < priorityOrder.indexOf(String(a[orderBy]))) {
      return -1;
    }
    if (priorityOrder.indexOf(String(b[orderBy])) > priorityOrder.indexOf(String(a[orderBy]))) {
      return 1;
    }
  }
  // if orderBy "dateReported" order by date
  if (orderBy === 'dateReported' || orderBy === 'dateResolved') {
    // @ts-ignore
    if (compareDate(b[orderBy], a[orderBy]) < 0) {
      return -1;
    }
    // @ts-ignore
    if (compareDate(b[orderBy], a[orderBy]) > 0) {
      return 1;
    }
  }

  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
    a: { [key in Key]: number | string | MyDate | null },
    b: { [key in Key]: number | string | MyDate | null },
  ) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Issue;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'id',
    numeric: true,
    disablePadding: false,
    label: 'ID',
  },
  {
    id: 'equipmentId',
    numeric: true,
    disablePadding: false,
    label: 'Equipment ID',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'priority',
    numeric: false,
    disablePadding: false,
    label: 'Priority',
  },
  {
    id: 'description',
    numeric: false,
    disablePadding: false,
    label: 'Description',
  },
  {
    id: 'dateReported',
    numeric: false,
    disablePadding: false,
    label: 'Date Reported',
  },
  {
    id: 'dateResolved',
    numeric: false,
    disablePadding: false,
    label: 'Date Resolved',
  },
  {
    id: 'resolutionDetails',
    numeric: false,
    disablePadding: false,
    label: 'Resolution Details',
  },
];

const DEFAULT_ORDER = 'desc';
const DEFAULT_ORDER_BY = 'dateReported';
const DEFAULT_ROWS_PER_PAGE = 10;

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, newOrderBy: keyof Issue) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort,
  } = props;
  const createSortHandler = (newOrderBy: keyof Issue) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, newOrderBy);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all issues',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="right"
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'desc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  handleResolve: () => void;
  handleMerge: () => void;
  handleDelete: () => void;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const {
    numSelected, handleResolve, handleMerge, handleDelete,
  } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) => alpha(
            theme.palette.primary.main,
            theme.palette.action.activatedOpacity,
          ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected}
          {' '}
          selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Issues
        </Typography>
      )}
      {numSelected > 1 ? (
        <Tooltip title="Merge">
          <IconButton onClick={handleMerge}>
            <MergeIcon />
          </IconButton>
        </Tooltip>
      ) : null}
      {numSelected > 0 ? (
        <>
          <Tooltip title="Resolve">
            <IconButton onClick={handleResolve}>
              <CheckIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

export default function EnhancedTable(props: TableProps) {
  const { issues, URL, getData } = props;
  const [rows, setRows] = React.useState<Issue[]>(issues);
  const [order, setOrder] = React.useState<Order>(DEFAULT_ORDER);
  const [orderBy, setOrderBy] = React.useState<keyof Issue>(DEFAULT_ORDER_BY);
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [visibleRows, setVisibleRows] = React.useState<Issue[] | null>(null);
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE);
  const [paddingHeight, setPaddingHeight] = React.useState(0);
  const [resolveDetailOpen, setResolveDetailOpen] = React.useState(false);
  const [resolveDetails, setResolveDetails] = React.useState('');

  React.useEffect(() => {
    let rowsOnMount = stableSort(
      rows,
      getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY),
    );
    rowsOnMount = rowsOnMount.slice(
      0 * DEFAULT_ROWS_PER_PAGE,
      0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE,
    );

    setVisibleRows(rowsOnMount);
  }, []);

  const handleRequestSort = React.useCallback(
    (event: React.MouseEvent<unknown>, newOrderBy: keyof Issue) => {
      const isAsc = orderBy === newOrderBy && order === 'asc';
      /* eslint-disable no-nested-ternary */
      const toggledOrder = orderBy !== newOrderBy ? 'desc' : isAsc ? 'desc' : 'asc';
      setOrder(toggledOrder);
      setOrderBy(newOrderBy);

      const sortedRows = stableSort(rows, getComparator(toggledOrder, newOrderBy));
      const newLastPage = Math.ceil(sortedRows.length / rowsPerPage) - 1;

      if (page === newLastPage) {
        setPage(newLastPage);
      } else {
        setPage(0);
      }

      const updatedRows = sortedRows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      );
      setVisibleRows(updatedRows);
    },
    [order, orderBy, page, rowsPerPage],
  );

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      // @ts-ignore
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = React.useCallback(
    (event: unknown, newPage: number) => {
      setPage(newPage);

      const sortedRows = stableSort(rows, getComparator(order, orderBy));
      const updatedRows = sortedRows.slice(
        newPage * rowsPerPage,
        newPage * rowsPerPage + rowsPerPage,
      );
      setVisibleRows(updatedRows);

      // Avoid a layout jump when reaching the last page with empty rows.
      const numEmptyRows = newPage > 0 ? Math.max(0, (1 + newPage) * rowsPerPage - rows.length) : 0;

      const newPaddingHeight = (dense ? 33 : 53) * numEmptyRows;
      setPaddingHeight(newPaddingHeight);
    },
    [order, orderBy, dense, rowsPerPage],
  );

  const handleChangeRowsPerPage = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const updatedRowsPerPage = parseInt(event.target.value, 10);
      setRowsPerPage(updatedRowsPerPage);

      setPage(0);

      const sortedRows = stableSort(rows, getComparator(order, orderBy));
      const updatedRows = sortedRows.slice(
        0 * updatedRowsPerPage,
        0 * updatedRowsPerPage + updatedRowsPerPage,
      );
      setVisibleRows(updatedRows);

      // There is no layout jump to handle on the first page.
      setPaddingHeight(0);
    },
    [order, orderBy],
  );

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  // Resolves the selected issues
  async function resolveIssues(selected_issues: any[]) {
    /* eslint-disable no-await-in-loop */
    /* eslint-disable no-restricted-syntax */
    for (const issue of selected_issues) {
      const resFetch = await fetch(`${URL}/${issue}`);
      const resFetchJSON = await resFetch.json();
      resFetchJSON.status = 'RESOLVED';
      resFetchJSON.resolutionDetails = resolveDetails;
      const date = new Date();
      resFetchJSON.dateResolved = {
        year: date.getFullYear(),
        month: date.getMonth() + 1, // add 1 because getMonth() returns 0-based index
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
      };
      const requestOptions = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resFetchJSON),
      };
      await fetch(`${URL}/${issue}`, requestOptions);
    }
  }

  // Add this function inside the EnhancedTable component
  const handleBatchResolve = async () => {
    setResolveDetailOpen(false);
    // @ts-ignore
    await resolveIssues(selected); // Add await keyword here
    // Call getData to refresh the data in the parent component
    const data = await getData();

    setSelected([]);
    // update the rows in the table
    // @ts-ignore
    setRows(data);
    setResolveDetails('');
  };

  const handleResolve = () => {
    setResolveDetailOpen(true);
  };

  const handleDelete = async () => {
    // delete selected issues
    await Promise.all(selected.map(async (issue) => {
      const requestOptions = {
        method: 'DELETE',
        credentials: 'include',
      };
      // @ts-ignore
      await fetch(`${URL}/${issue}`, requestOptions);
    }));
    // Call getData to refresh the data in the parent component
    const data = await getData();
    setSelected([]);
    // update the rows in the table
    // @ts-ignore
    setRows(data);
  };

  const handleMerge = async () => {
    // check that there are at least 2 issues selected
    if (selected.length < 2) {
      alert('Please select at least 2 issues to merge.');
      return;
    }
    // check that all selected issues have the same equipmentID
    const selectedIssues = await Promise.all(selected.map(async (issue) => {
      const resFetch = await fetch(`${URL}/${issue}`);
      const resFetchJSON = await resFetch.json();
      return resFetchJSON;
    }));
    const equipmentIDs = selectedIssues.map((issue) => issue.equipmentId);
    // @ts-ignore
    const uniqueEquipmentIDs = [...new Set(equipmentIDs)];
    console.log(uniqueEquipmentIDs);
    if (uniqueEquipmentIDs.length > 1) {
      alert('Please select issues with the same equipmentID to merge.');
      return;
    }
    // create a new issue with the same equipmentID
    const priorityOrder = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
    const priorities = selectedIssues.map((issue) => issue.priority);
    /* eslint-disable-next-line max-len */
    const maxPriority = priorities.reduce((a, b) => (priorityOrder.indexOf(a) > priorityOrder.indexOf(b) ? a : b));
    const mergedDescription = selectedIssues.map((issue) => issue.description).join('\n');
    const date = new Date();
    const newIssue = {
      id: 1,
      equipmentId: uniqueEquipmentIDs[0],
      status: 'NEW',
      dateReported: {
        year: date.getFullYear(),
        month: date.getMonth() + 1, // add 1 because getMonth() returns 0-based index
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
      },
      priority: maxPriority,
      description: mergedDescription,
      assignedTo: null,
      dateResolved: null,
      resolutionDetails: null,
      notes: null,
    };
    // create the new issue
    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newIssue),
    };
    await fetch(URL, requestOptions);
    // delete the old issues
    await Promise.all(selected.map(async (issue) => {
      const requestOptionsDelete = {
        method: 'DELETE',
        credentials: 'include',
      };
      // @ts-ignore
      await fetch(`${URL}/${issue}`, requestOptionsDelete);
    }));
    const data = await getData();

    setSelected([]);
    // update the rows in the table
    // @ts-ignore
    setRows(data);
  };

  // refresh table when visible rows change
  React.useEffect(() => {
    const sortedRows = stableSort(rows, getComparator(order, orderBy));
    const updatedRows = sortedRows.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
    setVisibleRows(updatedRows);
  }, [rows]);

  const handleDetailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResolveDetails(event.target.value);
  };

  /* eslint-disable max-len */
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} handleResolve={handleResolve} handleMerge={handleMerge} handleDelete={handleDelete} />
        <Dialog open={resolveDetailOpen} PaperProps={{ sx: { width: '60%' } }}>
          <DialogTitle>Resolution Details</DialogTitle>
          <DialogContent>
            <TextField
              label="Enter Details"
              multiline
              rows={6}
              variant="standard"
              fullWidth
              value={resolveDetails}
              onChange={handleDetailChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setResolveDetailOpen(false)}>Cancel</Button>
            <Button onClick={handleBatchResolve}>Resolve</Button>
          </DialogActions>
        </Dialog>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows
                ? visibleRows.map((row, index) => {
                  // @ts-ignore
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  // @ts-ignore
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, (row.id as unknown as string))}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        align="right"
                      >
                        {row.id}
                      </TableCell>
                      <TableCell align="right">{row.equipmentId}</TableCell>
                      <TableCell align="right">{row.status}</TableCell>
                      <TableCell align="right">{row.priority}</TableCell>
                      <TableCell align="right">{row.description}</TableCell>
                      <TableCell align="right">{displayDate(row.dateReported)}</TableCell>
                      <TableCell align="right">{displayDate(row.dateResolved)}</TableCell>
                      <TableCell align="right">{row.resolutionDetails}</TableCell>
                    </TableRow>
                  );
                })
                : null}
              {paddingHeight > 0 && (
              <TableRow
                style={{
                  height: paddingHeight,
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}
