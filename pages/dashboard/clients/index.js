import {
  DeleteOutlined,
  EditOutlined,
  EyeTwoTone,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import {
  Col,
  Collapse,
  Input,
  Row,
  Button,
  Space,
  Modal,
  Table,
  Form,
} from "antd";
import { useContext, useEffect, useState, useMemo } from "react";
import DashboardLayout from "../../../components/shared/layout";
import { useRouter } from "next/router";
import { GeneralContext } from "../../_app";
import Loading from "../../../components/shared/loading";
import { Typography } from "antd";
import useClients from "../../../components/clients/hooks/useClients";
import { message } from "antd";
import Title from "../../../components/shared/title";
import Link from "next/link";

export default function ClientsPage() {
  const columns = [
    {
      title: "Razón social",
      dataIndex: "nameClient",
      key: 0,
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Dirección",
      dataIndex: "address",
      key: 2,
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Teléfono",
      dataIndex: "phone",
      key: 3,
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Acciones",
      key: 4,
      render: (client, index) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => router.push(`clients/${_.idClient}`)}
          >
            <EyeTwoTone />
          </Button>
          <Button type="primary" onClick={() => confirmDelete(client)} danger>
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  const confirmDelete = (client) => {
    Modal.confirm({
      title: "Eliminar",
      icon: <ExclamationCircleFilled />,
      content: "Estas seguro de eliminar este cliente?",
      okText: "Eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      onOk() {
        const filteredClients = data.filter((c) => c.key !== client.key);
        setData(filteredClients);
      },
      onCancel() {},
    });
  };

  // Tabla' date
  const [data, setData] = useState([]);

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // clients
  // const [clients, setClients] = useState([]);
  const { clients, listClients } = useClients();
  const [query, setQuery] = useState({
    nameClient: "",
    phone: "",
    address: "",
  });

  const handleSeeModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const generalContext = useContext(GeneralContext);

  const getClientsRequest = async () => {
    setLoading(true);
    try {
      await listClients();
    } catch (error) {
      message.error("Ha ocurrido un error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Object.keys(generalContext).length) {
      getClientsRequest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generalContext]);

  const [form] = Form.useForm();

  const onReset = () => {
    setQuery({
      fullNameClient: "",
      phoneClient: "",
      address: "",
    });
    form.resetFields();
  };

  const clientsList = useMemo(() => {
    let list = clients;
    for (const [key, value] of Object.entries(query)) {
      if (value) {
        list = list.filter((c) =>
          c[key]?.toLowerCase().includes(query[key].toLowerCase())
        );
      }
    }
    return list;
  }, [query, clients]);

  const handleSearch = (values) => {
    setQuery({
      nameClient: values.fullNameClient || "",
      phone: values.phoneClient || "",
      address: values.address || "",
    });
  };

  return (
    <DashboardLayout>
      <div
        style={{
          margin: "1rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Title title={"Clientes"}>
          <Link href="/dashboard/clients/add">
            <Button type="primary">Agregar</Button>
          </Link>
        </Title>
        <Collapse style={{ width: "100%", marginBottom: "2rem" }}>
          <Collapse.Panel header="Filtros">
            <Row style={{ justifyContent: "center" }}>
              <Form
                labelCol={{ span: 8 }}
                style={{ width: "800px" }}
                form={form}
                onFinish={handleSearch}
              >
                <Row>
                  <Col span={12}>
                    <Form.Item name="fullNameClient" label="Razon social">
                      <Input type="text" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="phoneClient" label="Teléfono">
                      <Input type="text" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item name="address" label="Dirección">
                      <Input type="text" />
                    </Form.Item>
                  </Col>
                  {/* <Col span={12}>
										<Form.Item name="rif" label="Rif">
											<Input type="text" />
										</Form.Item>
									</Col> */}
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      wrapperCol={{
                        span: 12,
                        offset: 8,
                      }}
                    >
                      <Button onClick={onReset} block>
                        Limpiar
                      </Button>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      wrapperCol={{
                        span: 12,
                        offset: 8,
                      }}
                    >
                      <Button htmlType="submit" type="primary" block>
                        Buscar
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Row>
          </Collapse.Panel>
        </Collapse>
        <Table columns={columns} dataSource={clientsList} />
      </div>
      <Modal
        title={"Detail"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleSeeModal}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
      <Loading isLoading={loading} />
    </DashboardLayout>
  );
}
