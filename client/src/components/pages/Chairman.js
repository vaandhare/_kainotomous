import React, { Component, Fragment } from 'react'
import { Table, Tag, Space, Drawer, Form, Button, Col, Row, Input, Select } from 'antd';
import { Card } from "reactstrap";
import {EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

class Chairman extends Component {

  state = { visible: false };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };


  render() {
    const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: tags => (
      <>
        {tags.map(tag => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <EditOutlined onClick={this.showDrawer} />
        <DeleteOutlined />
      </Space>
    ),
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

    return (
      <Fragment>
        <h3 style={{ textAlign: "center", color: "gray", margin: "10px" }}>Manage Users</h3>
        <Card style={{margin: "10px", padding: "10px"}}>
          <Button type="primary" onClick={this.showDrawer} style={{margin: "10px"}}>
            <PlusOutlined />Add user</Button>
          <Table columns={columns} dataSource={data} /> 
          <Drawer
          title="Create new user/Make changes in existing users."
          width={450}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
          footer={
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button onClick={this.onClose} type="primary">
                Submit
              </Button>
            </div>
          }
        >
          <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[{ required: true, message: 'Please enter user name' }]}
                >
                  <Input placeholder="Please enter user name" />
                </Form.Item>
              </Row>
              <Row gutter={16}>
                <Form.Item
                  name="designation"
                  label="Designation"
                  rules={[{ required: true, message: 'Please choose the designation' }]}
                >
                  <Select placeholder="Please choose the type">
                    <Option value="MoCA">MoCA</Option>
                      <Option value="DGCA">DGCA</Option>
                      <Option value="AI">AI</Option>
                  </Select>
                </Form.Item>

              </Row>
              <Row gutter={16}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, message: 'Please enter user email' }]}
                  >
                    <Input placeholder="Please enter user email" />
                  </Form.Item>
              </Row>
              <Row gutter={16}>
                <Form.Item
                    name="aerodrome"
                    label="Aerodrome"
                    rules={[{ required: true, message: 'Please choose user Aerodrome' }]}
                  >
                    <Select placeholder="Please choose user Aerodrome">
                      <Option value="agatti">Agatti Airport</Option>
                        <Option value="hubli">Hubli Airport</Option>
                        <Option value="surat">Surat Airport</Option>
                    </Select>
                </Form.Item>
              </Row>
              <Row gutter={16}>
                  <Form.Item
                    name="address"
                    label="Address"
                    rules={[{ required: true, message: 'Please enter user Address' }]}
                  >
                    <Input placeholder="Please enter user Address" />
                  </Form.Item>
                </Row>
          </Form>
        </Drawer>
        </Card>
      </Fragment>
    )
  }
}

export default Chairman;