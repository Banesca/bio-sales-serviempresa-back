import { Button, Input } from "antd";
import { Col, Form, Row } from "antd";
import { Collapse } from "antd";

export default function BrandsFilters({ setQuery }) {

	const [searchForm] = Form.useForm();

    const onReset = () => {
        setQuery('')
        searchForm.resetFields()
    }

    const handleSearch = (values) => {
        setQuery(values.name)
        console.log(values)
    }

    return(
		<Collapse style={{ width: '100%', marginBottom: '2rem' }}>
			<Collapse.Panel header="Filtros">
				<Form
					style={{ maxWidth: '800px', width: '100%' }}
					labelCol={{ span: 6 }}
					onFinish={handleSearch}
					form={searchForm}
				>
					<Row>
						<Col span={24}>
							<Form.Item
								label="nombre"
								name="name"
								wrapperCol={{
									span: 16,
								}}
							>
								<Input allowClear />
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={12}>
							<Form.Item
								wrapperCol={{
									span: 12,
									offset: 8,
								}}
							>
								<Button block onClick={onReset}>
									Limpiar
								</Button>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item wrapperCol={{ span: 12, offset: 8 }}>
								<Button htmlType="submit" type="primary" block>
									Buscar
								</Button>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Collapse.Panel>
		</Collapse>
    )
}