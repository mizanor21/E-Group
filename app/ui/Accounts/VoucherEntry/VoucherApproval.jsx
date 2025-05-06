import React, { useState } from 'react';

const VoucherApproval = () => {
    const [vouchers, setVouchers] = useState([
        { id: 1, name: 'Voucher 1', status: 'Pending' },
        { id: 2, name: 'Voucher 2', status: 'Pending' },
        { id: 3, name: 'Voucher 3', status: 'Pending' },
    ]);

    const handleApprove = (id) => {
        setVouchers((prevVouchers) =>
            prevVouchers.map((voucher) =>
                voucher.id === id ? { ...voucher, status: 'Approved' } : voucher
            )
        );
    };

    const handleReject = (id) => {
        setVouchers((prevVouchers) =>
            prevVouchers.map((voucher) =>
                voucher.id === id ? { ...voucher, status: 'Rejected' } : voucher
            )
        );
    };

    return (
        <div>
            <h1>Voucher Approval</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {vouchers.map((voucher) => (
                        <tr key={voucher.id}>
                            <td>{voucher.id}</td>
                            <td>{voucher.name}</td>
                            <td>{voucher.status}</td>
                            <td>
                                <button onClick={() => handleApprove(voucher.id)}>Approve</button>
                                <button onClick={() => handleReject(voucher.id)}>Reject</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VoucherApproval;