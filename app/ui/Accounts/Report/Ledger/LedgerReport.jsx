'use client'

import { usePaymentVouchersByYearData } from "@/app/data/DataFetch";
import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Chip,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormGroup,
  FormControlLabel,
  useTheme,
  ToggleButton,
  ToggleButtonGroup,
  Stack
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import DownloadIcon from '@mui/icons-material/Download';

// Define column structure
const columnDefinitions = [
  { id: 'voucherNo', label: 'Voucher No', visible: true },
  { id: 'date', label: 'Date', visible: true },
  { id: 'project', label: 'Project', visible: true },
  { id: 'company', label: 'Company', visible: true },
  { id: 'paymentMethod', label: 'Payment Method', visible: true },
  { id: 'paidFrom', label: 'Paid From', visible: false },
  { id: 'expenseHead', label: 'Expense Head', visible: true },
  { id: 'paidTo', label: 'Paid To', visible: true },
  { id: 'amount', label: 'Amount (BDT)', visible: true, align: 'right' },
  { id: 'narration', label: 'Narration', visible: false },
  { id: 'status', label: 'Status', visible: true }
];

export default function LedgerReport() {
    const theme = useTheme();
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedProject, setSelectedProject] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedExpenseHead, setSelectedExpenseHead] = useState('all');
    const [columns, setColumns] = useState(columnDefinitions);
    const [showColumnDialog, setShowColumnDialog] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filterPanelOpen, setFilterPanelOpen] = useState(false);

    const { data, error, isLoading } = usePaymentVouchersByYearData({
        params: { year: selectedYear }
    });

    // Get unique projects and expense heads for filter dropdowns
    const [projects, expenseHeads] = useMemo(() => {
        if (!data) return [[], []];
        
        const uniqueProjects = new Set(data.map(item => item.project));
        const uniqueExpenseHeads = new Set();
        
        data.forEach(voucher => {
            voucher.voucherRows.forEach(row => {
                if (row.expenseHead) {
                    uniqueExpenseHeads.add(row.expenseHead);
                }
            });
        });

        return [Array.from(uniqueProjects), Array.from(uniqueExpenseHeads)];
    }, [data]);

    // Filter data based on selected filters
    const filteredData = useMemo(() => {
        if (!data) return [];

        return data.filter(voucher => {
            // Filter by date range
            const voucherDate = new Date(voucher.date);
            if (startDate && voucherDate < startDate) return false;
            if (endDate && voucherDate > endDate) return false;

            // Filter by project
            if (selectedProject !== 'all' && voucher.project !== selectedProject) return false;

            // Filter by status
            if (selectedStatus !== 'all') {
                if (selectedStatus === 'mixed') {
                    // For mixed status, check if any row has different status than global
                    const hasMixedStatus = voucher.voucherRows.some(
                        row => row.status !== voucher.status
                    );
                    if (!hasMixedStatus) return false;
                } else {
                    const statusBool = selectedStatus === 'true';
                    if (voucher.status !== statusBool) return false;
                }
            }

            // Filter by expense head if any rows match
            if (selectedExpenseHead !== 'all') {
                const hasMatchingExpenseHead = voucher.voucherRows.some(
                    row => row.expenseHead === selectedExpenseHead
                );
                if (!hasMatchingExpenseHead) return false;
            }

            // Global search filter
            if (searchText) {
                const searchLower = searchText.toLowerCase();
                const matchesVoucher = voucher.lastVoucher.toLowerCase().includes(searchLower) || 
                                      voucher.project.toLowerCase().includes(searchLower) ||
                                      voucher.company.toLowerCase().includes(searchLower);
                
                const matchesRows = voucher.voucherRows.some(row => 
                    row.expenseHead.toLowerCase().includes(searchLower) ||
                    row.paidTo.toLowerCase().includes(searchLower) ||
                    row.narration.toLowerCase().includes(searchLower))
                
                if (!matchesVoucher && !matchesRows) return false;
            }

            return true;
        });
    }, [data, startDate, endDate, selectedProject, selectedStatus, selectedExpenseHead, searchText]);

    // Calculate total amount for all displayed rows
    const totalAmount = useMemo(() => {
        return filteredData.reduce((total, voucher) => {
            return total + voucher.voucherRows.reduce((voucherTotal, row) => {
                // Check row status (if global status is false, check individual row status)
                const rowApproved = voucher.status || row.status;
                
                // Only include rows that match expense head filter if applied
                if ((selectedExpenseHead === 'all' || row.expenseHead === selectedExpenseHead) &&
                    (selectedStatus === 'all' || 
                     (selectedStatus === 'true' && rowApproved) ||
                     (selectedStatus === 'false' && !rowApproved) ||
                     (selectedStatus === 'mixed' && row.status !== voucher.status))) {
                    return voucherTotal + Number(row.amountBDT || 0);
                }
                return voucherTotal;
            }, 0);
        }, 0);
    }, [filteredData, selectedExpenseHead, selectedStatus]);

    const toggleColumnVisibility = (columnId) => {
        setColumns(columns.map(col => 
            col.id === columnId ? { ...col, visible: !col.visible } : col
        ));
    };

    const visibleColumns = columns.filter(col => col.visible);

    const getRowStatus = (voucherStatus, rowStatus) => {
        if (voucherStatus) return 'Approved'; // Global approval overrides individual
        return rowStatus ? 'Approved' : 'Pending';
    };

    const getRowStatusColor = (voucherStatus, rowStatus) => {
        if (voucherStatus) return 'success'; // Global approval overrides individual
        return rowStatus ? 'success' : 'warning';
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading data.</div>;
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" gutterBottom>
                        Ledger Report
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Tooltip title="Download Report">
                            <IconButton color="primary">
                                <DownloadIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Column Visibility">
                            <IconButton 
                                color="primary" 
                                onClick={() => setShowColumnDialog(true)}
                            >
                                <ViewColumnIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Filter Panel">
                            <IconButton 
                                color="primary" 
                                onClick={() => setFilterPanelOpen(!filterPanelOpen)}
                            >
                                <FilterListIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
                
                {/* Filters Section */}
                <Collapse in={filterPanelOpen}>
                    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                        <Stack spacing={2}>
                            <TextField
                                label="Search"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                            
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <FormControl sx={{ minWidth: 120 }} size="small">
                                    <InputLabel>Year</InputLabel>
                                    <Select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                        label="Year"
                                    >
                                        {Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString()).map(year => (
                                            <MenuItem key={year} value={year}>
                                                {year}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <DatePicker
                                    label="Start Date"
                                    value={startDate}
                                    onChange={setStartDate}
                                    renderInput={(params) => <TextField {...params} size="small" sx={{ width: 180 }} />}
                                />

                                <DatePicker
                                    label="End Date"
                                    value={endDate}
                                    onChange={setEndDate}
                                    renderInput={(params) => <TextField {...params} size="small" sx={{ width: 180 }} />}
                                />

                                <FormControl sx={{ minWidth: 120 }} size="small">
                                    <InputLabel>Project</InputLabel>
                                    <Select
                                        value={selectedProject}
                                        onChange={(e) => setSelectedProject(e.target.value)}
                                        label="Project"
                                    >
                                        <MenuItem value="all">All Projects</MenuItem>
                                        {projects.map(project => (
                                            <MenuItem key={project} value={project}>
                                                {project}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl sx={{ minWidth: 150 }} size="small">
                                    <InputLabel>Expense Head</InputLabel>
                                    <Select
                                        value={selectedExpenseHead}
                                        onChange={(e) => setSelectedExpenseHead(e.target.value)}
                                        label="Expense Head"
                                    >
                                        <MenuItem value="all">All Expense Heads</MenuItem>
                                        {expenseHeads.map(head => (
                                            <MenuItem key={head} value={head}>
                                                {head}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl sx={{ minWidth: 150 }} size="small">
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        label="Status"
                                    >
                                        <MenuItem value="all">All Statuses</MenuItem>
                                        <MenuItem value="true">Approved</MenuItem>
                                        <MenuItem value="false">Pending</MenuItem>
                                        <MenuItem value="mixed">Mixed Status</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            
                            {/* Active filters */}
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {selectedProject !== 'all' && (
                                    <Chip 
                                        label={`Project: ${selectedProject}`} 
                                        onDelete={() => setSelectedProject('all')}
                                    />
                                )}
                                {selectedExpenseHead !== 'all' && (
                                    <Chip 
                                        label={`Expense: ${selectedExpenseHead}`} 
                                        onDelete={() => setSelectedExpenseHead('all')}
                                    />
                                )}
                                {selectedStatus !== 'all' && (
                                    <Chip 
                                        label={`Status: ${
                                            selectedStatus === 'true' ? 'Approved' : 
                                            selectedStatus === 'false' ? 'Pending' : 'Mixed'
                                        }`} 
                                        onDelete={() => setSelectedStatus('all')}
                                    />
                                )}
                                {searchText && (
                                    <Chip 
                                        label={`Search: ${searchText}`} 
                                        onDelete={() => setSearchText('')}
                                    />
                                )}
                            </Box>
                        </Stack>
                    </Paper>
                </Collapse>

                {/* Results Count and Total Amount */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 2,
                    p: 1,
                    backgroundColor: theme.palette.grey[100],
                    borderRadius: 1
                }}>
                    <Typography variant="subtitle1">
                        Showing {filteredData.length} vouchers with {filteredData.reduce((acc, voucher) => acc + voucher.voucherRows.length, 0)} entries
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                        Total Amount: {totalAmount.toLocaleString()} BDT
                    </Typography>
                </Box>

                {/* Table Section */}
                <Paper elevation={2}>
                    <TableContainer sx={{ maxHeight: 'calc(100vh - 320px)' }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {visibleColumns.map(column => (
                                        <TableCell 
                                            key={column.id}
                                            align={column.align || 'left'}
                                            sx={{ fontWeight: 'bold' }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData.flatMap((voucher) => 
                                    voucher.voucherRows
                                        .filter(row => 
                                            (selectedExpenseHead === 'all' || row.expenseHead === selectedExpenseHead) &&
                                            (selectedStatus === 'all' || 
                                             (selectedStatus === 'true' && (voucher.status || row.status)) ||
                                             (selectedStatus === 'false' && !voucher.status && !row.status) ||
                                             (selectedStatus === 'mixed' && row.status !== voucher.status))
                                        )
                                        .map((row, index) => (
                                            <TableRow 
                                                key={`${voucher._id}-${index}`}
                                                hover
                                                sx={{ 
                                                    '&:nth-of-type(odd)': {
                                                        backgroundColor: theme.palette.action.hover
                                                    }
                                                }}
                                            >
                                                {visibleColumns.some(c => c.id === 'voucherNo') && (
                                                    <TableCell>{voucher.lastVoucher}</TableCell>
                                                )}
                                                {visibleColumns.some(c => c.id === 'date') && (
                                                    <TableCell>
                                                        {new Date(voucher.date).toLocaleDateString()}
                                                    </TableCell>
                                                )}
                                                {visibleColumns.some(c => c.id === 'project') && (
                                                    <TableCell>{voucher.project}</TableCell>
                                                )}
                                                {visibleColumns.some(c => c.id === 'company') && (
                                                    <TableCell>{voucher.company}</TableCell>
                                                )}
                                                {visibleColumns.some(c => c.id === 'paymentMethod') && (
                                                    <TableCell>{voucher.transitionType}</TableCell>
                                                )}
                                                {visibleColumns.some(c => c.id === 'paidFrom') && (
                                                    <TableCell>{voucher.paidFromBank}</TableCell>
                                                )}
                                                {visibleColumns.some(c => c.id === 'expenseHead') && (
                                                    <TableCell>{row.expenseHead}</TableCell>
                                                )}
                                                {visibleColumns.some(c => c.id === 'paidTo') && (
                                                    <TableCell>{row.paidTo}</TableCell>
                                                )}
                                                {visibleColumns.some(c => c.id === 'amount') && (
                                                    <TableCell align="right">
                                                        {Number(row.amountBDT).toLocaleString()}
                                                    </TableCell>
                                                )}
                                                {visibleColumns.some(c => c.id === 'narration') && (
                                                    <TableCell>{row.narration}</TableCell>
                                                )}
                                                {visibleColumns.some(c => c.id === 'status') && (
                                                    <TableCell>
                                                        <Chip 
                                                            label={getRowStatus(voucher.status, row.status)} 
                                                            color={getRowStatusColor(voucher.status, row.status)}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                {/* Column Visibility Dialog */}
                <Dialog 
                    open={showColumnDialog} 
                    onClose={() => setShowColumnDialog(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Column Visibility</DialogTitle>
                    <DialogContent>
                        <FormGroup>
                            {columns.map(column => (
                                <FormControlLabel
                                    key={column.id}
                                    control={
                                        <Checkbox
                                            checked={column.visible}
                                            onChange={() => toggleColumnVisibility(column.id)}
                                        />
                                    }
                                    label={column.label}
                                />
                            ))}
                        </FormGroup>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowColumnDialog(false)}>Close</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </LocalizationProvider>
    );
}