import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Papa from "papaparse";

const CsvManagement = () => {
  const [csvData, setCsvData] = useState([]);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      Papa.parse(file, {
        complete: (result) => {
          setCsvData(result.data);
        },
        header: true,
      });
    }
  };

  const handleDownload = () => {
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", fileName || "edited.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddRow = () => {
    setCsvData([...csvData, {}]);
  };

  const handleDeleteRow = (index) => {
    const newData = csvData.filter((_, i) => i !== index);
    setCsvData(newData);
  };

  const handleEditCell = (rowIndex, columnName, value) => {
    const newData = [...csvData];
    newData[rowIndex][columnName] = value;
    setCsvData(newData);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>CSV Management Tool</CardTitle>
          <p>Upload, view, and edit your CSV files easily.</p>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input type="file" accept=".csv" onChange={handleFileUpload} />
            {fileName && <p className="mt-2">Uploaded File: {fileName}</p>}
          </div>
          <Separator />
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  {csvData.length > 0 &&
                    Object.keys(csvData[0]).map((key) => (
                      <TableHead key={key}>{key}</TableHead>
                    ))}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {csvData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {Object.keys(row).map((columnName) => (
                      <TableCell key={columnName}>
                        <Input
                          value={row[columnName]}
                          onChange={(e) =>
                            handleEditCell(rowIndex, columnName, e.target.value)
                          }
                        />
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button
                        variant="outline"
                        onClick={() => handleDeleteRow(rowIndex)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button className="mt-4" onClick={handleAddRow}>
              Add Row
            </Button>
          </div>
          <Separator />
          <div className="mt-4">
            <Button onClick={handleDownload}>Download CSV</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CsvManagement;