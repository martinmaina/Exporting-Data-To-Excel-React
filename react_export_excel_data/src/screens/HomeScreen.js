import React, { useEffect, useState } from 'react';
import { Card, Form, Table } from 'react-bootstrap';
import axios from 'axios';

import ReactExport from 'react-data-export';
import { ScaleLoader } from 'react-spinners';


const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelSheet;

export default function HomeScreen() {

    const [orders, setOrders] = useState([]);
    const [exportData, setExportData] = useState([]);
    const [loading, setLoading] = useState(false);


    const override = `
        display:flex;
        align-items:center;
        justify-content:center;
        border-color:red;
    `;
    const getAllOrders = async () => {
        const data = await axios.get("http://localhost:8080/api/orders")
        setOrders(data.data);
    }
    useEffect(() => {
        getAllOrders();
    }, []);

    const orderChangeHandler = async (e) => {
        console.log(orders);
        setExportData([]);
        setLoading(true);
        const data = getData(e.target.value);
        console.log(getData(e.target.value));
        setExportData(data);
        setLoading(false);
    }

    const getData = async (orderId) => {
        try {
            const data = await axios.get(`http://localhost:8080/api/orders/${orderId}`);
            console.log(data.data);
            setExportData(data.data);
            return data.data;
        } catch (error) {
            throw error;
        }
    }
    return (
        <div className='container'>
            <Card >
                <Card.Body>
                    <Card.Title>Excel Export</Card.Title>
                    <Form>
                        <Form.Label>Select Order</Form.Label>
                        <Form.Control as="select" defaultValue={"Choose ..."} onChange={(e) => orderChangeHandler(e)}>
                            <option value={""}>Choose an order...</option>
                            {orders.map((order, i) =>
                                <option key={i} value={order.id}>Order {order.id}</option>
                            )}
                        </Form.Control>
                    </Form>
                    {
                        exportData.length !== 0 ? (
                            <ExcelFile
                                filename="Orders data"
                                element={
                                    <button type='button' className='btn btn-success float-right m-3'>Export Orders</button>
                                }>
                                <ExcelSheet dataSet={""} name="Orders Export" />
                            </ExcelFile>
                        ) : null
                    }
                    <Table responsive>
                        <thead>
                            <tr>
                                <th scope='col'> Order Id</th>
                                <th scope='col'>Item Id</th>
                                <th scope='col'>Size</th>
                                <th scope='col'>Toppings</th>
                                <th scope='col'>Price</th>
                                <th scope='col'>Totals</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                exportData.length === 0 ? (
                                    <tr>
                                        <td colSpan={6}>
                                            <ScaleLoader
                                                css={override}
                                                size={150}
                                                color={"#eb4034"}
                                                loading={loading} />
                                        </td>
                                    </tr>
                                ) : (
                                    <>
                                        {
                                            exportData.map((data) => (
                                                <React.Fragment key={data.id}>
                                                    <tr>
                                                        <td rowSpan={data.length}>{data.id}</td>
                                                    </tr>

                                                    {
                                                        data.items.map((item, itemIndex) => (
                                                            <tr key={item.id}>
                                                                <td>{item.id}</td>
                                                                <td>{item.size}</td>
                                                                <td>{item.toppings.replace(/,/g, ', ')}</td>
                                                                <td><i>{item.price.toFixed(2)}</i></td>

                                                            </tr>
                                                        ))
                                                    }

                                                    <tr>
                                                        <th scope='row'></th>
                                                        <td colSpan={data.items.length === 1 ? 2 : 3}></td>
                                                        <th colSpan={1}>Subtotal</th>
                                                        <th colSpan={1}>${data.orderTotals.subtotal.toFixed(2)}</th>
                                                    </tr>
                                                    <tr>
                                                        <th scope='row'></th>
                                                        <td colSpan={data.items.length === 1 ? 2 : 3}></td>
                                                        <th colSpan={1}>GST:</th>
                                                        <th colSpan={1}>${data.orderTotals.goodsAndServicesTax.toFixed(2)}</th>
                                                    </tr>
                                                    <tr>
                                                        <th scope='row'></th>
                                                        <td colSpan={3}></td>
                                                        <th colSpan={1}>Net Total:</th>
                                                        <th colSpan={1}>${data.orderTotals.netTotal.toFixed(2)}</th>
                                                    </tr>

                                                </React.Fragment>
                                            ))
                                        }</>
                                )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    )
}
