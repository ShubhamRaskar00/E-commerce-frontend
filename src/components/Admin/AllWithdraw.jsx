import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../../server";
import { Link } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import { BsPencil } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";
import { toast } from "react-toastify";
import { TbListDetails } from "react-icons/tb";
import { FaCopy } from "react-icons/fa";

const CopyField = ({ fieldName, fieldValue, copyToClipboard }) => (
  <>
    <label htmlFor="">{fieldName}</label>
    <div className="text-xl px-2 flex justify-between">
      <span>{fieldValue}</span>
      <FaCopy
        className="cursor-pointer"
        onClick={() => copyToClipboard(fieldValue)}
      />
    </div>
  </>
);

const AllWithdraw = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [withdrawData, setWithdrawData] = useState();
  const [withdrawStatus, setWithdrawStatus] = useState("Processing");
  const [accountData, setAccountData] = useState();

  useEffect(() => {
    axios
      .get(`${server}/withdraw/get-all-withdraw-request`, {
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data.withdraws);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  }, []);

  const columns = [
    { field: "id", headerName: "Withdraw Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Shop Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "amount",
      headerName: "Amount",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "status",
      headerName: "status",
      type: "text",
      minWidth: 80,
      flex: 0.5,
    },
    {
      field: "createdAt",
      headerName: "Request given at",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "",
      headerName: "User Account",
      minWidth: 130,
      type: "number",
      flex: 0.6,
      renderCell: (params) => {
        return (
          <TbListDetails
            size={20}
            className={"mr-5 cursor-pointer"}
            onClick={() => setOpen1(true) || setAccountData(params.row)}
          />
        );
      },
    },
    {
      field: " ",
      headerName: "Update Status",
      type: "number",
      minWidth: 130,
      flex: 0.6,
      renderCell: (params) => {
        return (
          <BsPencil
            size={20}
            className={`${
              params.row.status !== "Processing" ? "hidden" : ""
            } mr-5 cursor-pointer`}
            onClick={() => setOpen(true) || setWithdrawData(params.row)}
          />
        );
      },
    },
  ];

  const handleSubmit = async () => {
    await axios
      .put(
        `${server}/withdraw/update-withdraw-request/${withdrawData.id}`,
        {
          sellerId: withdrawData.shopId,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Withdraw request updated successfully!");
        setData(res.data.withdraws);
        setOpen(false);
        window.location.reload();
      });
  };

  const row = [];
  // Account Data
  const accountDetails =
    accountData && data
      ? data.find((item) => item._id === accountData.id)
      : null;

  data &&
    data.forEach((item) => {
      row.push({
        id: item._id,
        // shopId: item.seller._id,
        name: item.seller.name,
        amount: "₹" + item.amount,
        status: item.status,
        createdAt: item.createdAt.slice(0, 10),
      });
    });

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .catch((error) => {
        console.error("Error copying text:", error);
      });
  };
  
  return (
    <div className="w-full flex items-center pt-5 justify-center">
      <div className="w-[95%] bg-white">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      </div>
      {open && (
        <div className="w-full fixed h-screen top-0 left-0 bg-[#00000031] z-[9999] flex items-center justify-center">
          <div className="w-[50%] min-h-[40vh] bg-white rounded shadow p-4">
            <div className="flex justify-end w-full">
              <RxCross1
                size={25}
                onClick={() => setOpen(false)}
                className="cursor-pointer"
              />
            </div>
            <h1 className="text-[25px] text-center font-Poppins">
              Update Withdraw status
            </h1>
            <br />
            <select
              name=""
              id=""
              onChange={(e) => setWithdrawStatus(e.target.value)}
              className="w-[200px] h-[35px] border rounded"
            >
              <option value={withdrawStatus}>{withdrawData.status}</option>
              <option value={withdrawStatus}>Succeed</option>
            </select>
            <button
              type="submit"
              className={`block ${styles.button} text-white !h-[42px] mt-4 text-[18px]`}
              onClick={handleSubmit}
            >
              Update
            </button>
          </div>
        </div>
      )}
      {open1 && (
        <div className="w-full fixed h-screen top-0 left-0 bg-[#00000031] z-[9999] flex items-center justify-center">
          <div className="w-[50%] min-h-[40vh] bg-white rounded shadow p-4">
            <div className="flex justify-end w-full">
              <RxCross1
                size={25}
                onClick={() => setOpen1(false)}
                className="cursor-pointer"
              />
            </div>
            <h1 className="text-[25px] text-center font-Poppins">
              Bank Account Details
            </h1>
            <br />
            {/* Bank Details */}
            <CopyField
              fieldName="Bank Holder Name"
              fieldValue={
                accountDetails?.seller.withdrawMethod.bankHolderName || ""
              }
              copyToClipboard={copyToClipboard}
            />
            <CopyField
              fieldName="Bank Account Number"
              fieldValue={
                accountDetails?.seller.withdrawMethod.bankAccountNumber || ""
              }
              copyToClipboard={copyToClipboard}
            />
            <CopyField
              fieldName="Bank Name"
              fieldValue={accountDetails?.seller.withdrawMethod.bankName || ""}
              copyToClipboard={copyToClipboard}
            />
            <CopyField
              fieldName="Bank Swift Code"
              fieldValue={
                accountDetails?.seller.withdrawMethod.bankSwiftCode || ""
              }
              copyToClipboard={copyToClipboard}
            />
            <CopyField
              fieldName="Bank Country"
              fieldValue={
                accountDetails?.seller.withdrawMethod.bankCountry || ""
              }
              copyToClipboard={copyToClipboard}
            />
            <CopyField
              fieldName="Bank Address"
              fieldValue={
                accountDetails?.seller.withdrawMethod.bankAddress || ""
              }
              copyToClipboard={copyToClipboard}
            />
            {/* <button
              type="submit"
              className={`block ${styles.button} text-white !h-[42px] mt-4 text-[18px]`}
              onClick={handleSubmit}
            >
              Update
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllWithdraw;
