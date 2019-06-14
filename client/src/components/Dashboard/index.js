import React, { Component } from "react";
import { Button, Form } from 'rimble-ui';

export default class Dashboard extends Component {
	render() {
		const { handleSubmit } = this.props;
		return (
			<div>
				<Form onSubmit={handleSubmit}>
			        <Form.Field label="Issuee Address" width={1}>
			          <Form.Input
			            type="text"
			            name="address"
			            required
			            placeholder="e.g. 0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A"
			            width={1}
			          />
			        </Form.Field>
			        <Form.Field label="Course Name" width={1}>
			          <Form.Input
			            type="text"
			            name="name"
			            required
			            width={1}
			          />
			        </Form.Field>
			        <Form.Field label="Course Description" width={1}>
			          <Form.Input
			            type="text"
			            name="description"
			            required
			            width={1}
			          />
			        </Form.Field>
			        <Form.Field label="Date of issue" width={1}>
			          <Form.Input
			            type="date"
			            name="date"
			            required
			            width={1}
			          />
			        </Form.Field>
			        <Form.Field label="Score" width={1}>
			          <Form.Input
			            type="number"
			            name="score"
			            required
			            width={1}
			          />
			        </Form.Field>
			        <Form.Field label="Organization Name" width={1}>
			          <Form.Input
			            type="text"
			            name="organization"
			            required
			            width={1}
			          />
			        </Form.Field>
			        <Button type="submit" width={1}>
			          Issue Certificate
			        </Button>
			    </Form>
			</div>
		);
	}
}