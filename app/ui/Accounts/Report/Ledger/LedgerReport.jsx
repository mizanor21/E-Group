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
  Box
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function LedgerReport() {
    const [selectedYear, setSelectedYear] = useState(
        new Date().getFullYear().toString()
    );
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedProject, setSelectedProject] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');

    const { data, error, isLoading } = usePaymentVouchersByYearData({
        params: { year: selectedYear }
    });

    // Get unique projects for filter dropdown
    const projects = useMemo(() => {
        if (!data) return [];
        const uniqueProjects = new Set(data.map(item => item.project));
        return Array.from(uniqueProjects);
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
                const statusBool = selectedStatus === 'true';
                if (voucher.status !== statusBool) return false;
            }

            return true;
        });
    }, [data, startDate, endDate, selectedProject, selectedStatus]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading data.</div>;
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Ledger Report
                </Typography>
                
                {/* /* Filters Section  */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Year</InputLabel>
                        <Select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            label="Year"
                        >
                            {Array.from({ length: 2075 - 2024 + 1 }, (_, i) => (2024 + i).toString()).map(year => (
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
                        renderInput={(params) => <TextField {...params} />}
                    />

                    <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={setEndDate}
                        renderInput={(params) => <TextField {...params} />}
                    />

                    <FormControl sx={{ minWidth: 120 }}>
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

                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            label="Status"
                        >
                            <MenuItem value="all">All Statuses</MenuItem>
                            <MenuItem value="true">Approved</MenuItem>
                            <MenuItem value="false">Pending</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {/* Results Count */ }
                <Typography variant="subtitle1" gutterBottom>
                    Showing {filteredData.length} vouchers with {filteredData.reduce((acc, voucher) => acc + voucher.voucherRows.length, 0)} entries
                </Typography>

                {/* Table Section */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Voucher No</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Project</TableCell>
                                <TableCell>Company</TableCell>
                                <TableCell>Payment Method</TableCell>
                                <TableCell>Paid From</TableCell>
                                <TableCell>Expense Head</TableCell>
                                <TableCell>Paid To</TableCell>
                                <TableCell>Amount (BDT)</TableCell>
                                <TableCell>Narration</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.flatMap((voucher) => 
                                voucher.voucherRows.map((row, index) => (
                                    <TableRow key={`${voucher._id}-${index}`}>
                                        <TableCell>{voucher.lastVoucher}</TableCell>
                                        <TableCell>
                                            {new Date(voucher.date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>{voucher.project}</TableCell>
                                        <TableCell>{voucher.company}</TableCell>
                                        <TableCell>{voucher.transitionType}</TableCell>
                                        <TableCell>{voucher.paidFromBank}</TableCell>
                                        <TableCell>{row.expenseHead}</TableCell>
                                        <TableCell>{row.paidTo}</TableCell>
                                        <TableCell>{row.amountBDT}</TableCell>
                                        <TableCell>{row.narration}</TableCell>
                                        <TableCell>
                                            {voucher.status ? 'Approved' : 'Pending'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </LocalizationProvider>
    );
}