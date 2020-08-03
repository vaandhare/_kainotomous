import React, { Component } from 'react';
import ashokSthambha from '../../assets/ashok_sthambha.png';
import { Card, Col, Row } from 'antd';
import { CardImg, Button } from 'reactstrap';
import Pdf from "react-to-pdf";

const ref = React.createRef();

class AerodromeLicenseCertificate extends Component {
	render() {
		return (
			<Row>
				<Col md={12}>
				<div ref={ref}>
					<Card style={{ borderWidth: '3px', borderColor: 'black', margin: '10px' }}>
						<div style={{ width: '100%', textAlign: 'center' }}>
							<CardImg
								src={ashokSthambha}
								style={{
									width: '100px',
									height: '130px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}
							/>
						</div>
						<h4 style={{ textAlign: 'center' }}>
							GOVERNMENT OF INDIA
							<h5>
								OFFICE OF THE DIRECTOR GENERAL OF CIVIL AVIATION<h6>DGCA COMPLEX, OPP. SAFDARJUNG AIRPORT, NEW DELHI- 110 003</h6>
							</h5>
						</h4>
						<p style={{ fontWeight: 'bold', textAlign: 'right' }}>
							File No: <p style={{ fontWeight: 'bold' }}>License No: </p>
						</p>
						<h5 style={{ textAlign: 'center' }}>AIRDROME LICENSE - PRIVATE USE</h5>
						<p style={{ textAlign: 'center' }}>
							The Director General of Civil Aviation, in exercise of the powers under Rule 78 of the
							Aircraft Rules, 1937 delegated vide S.O. No. 727 (E) dated the 4th October, 1994, hereby
							grants license to,
						</p>
						<h5 style={{ fontWeight: 'bold', fontStyle: 'italic', textAlign: 'center' }}>
							Lincense Holder Name
						</h5>
						<p style={{ textAlign: 'center' }}>for</p>
						<h5 style={{ fontWeight: 'bold', textAlign: 'center', fontStyle: 'italic' }}>
							Name & Place of Aerodrome
						</h5>
						<p style={{ textAlign: 'center' }}>
							Lattitude: <h6 style={{ fontWeight: 'bold', display: 'inline' }}>00° 00´00.00˝ N</h6>{' '}
							Longitude: <h6 style={{ fontWeight: 'bold', display: 'inline' }}>00° 00´00.00˝ N</h6>
						</p>
						<p style={{ textAlign: 'center' }}>
							{' '}
							the details of the aerodrome as contained in its Aerodrome Manual.
						</p>
						<p style={{ textAlign: 'center' }}>
							This license authorizes the aerodrome to be used as regular place of landing and departure
							to all persons on equal terms and conditions for operation by aircraft requiring
							specifications of runway and associated facilities equal to or less than those indicated in
							the aerodrome Manual, subject to the conditions as contained in schedule-I and for a period
							as shown in Schedule-II hereto.
						</p>
						<p style={{ textAlign: 'center' }}>
							The license is liable to be suspended/ modified/ withdrawn/ and/or any limitations or
							conditions may be imposed, if any violation of the provisions of the Aircraft Act 1934,
							Aircraft Rules 1937, or any orders/ directions/ requirements issued under the said Act,
							rules or of the limitations or conditions as in schedule-I are observed.
						</p>
						<p style={{ textAlign: 'center' }}>This Aerodrome License is not transferable.</p>
						<br />
						<p style={{ fontWeight: 'bold' }}>
							Date of Issue: <p style={{ fontWeight: 'bold' }}>Place: </p>{' '}
						</p>
						<br />
						<h6 style={{ textAlign: 'center' }}>DIRECTOR GENERAL OF CIVIL AVIATION</h6>
					</Card>
					</div>
				</Col>
				<Col md={6}>
					<Pdf targetRef={ref} filename="AerodromeLicense.pdf">
        		{({ toPdf }) => 					<Button style={{ margin: '30px' }} color="success" onClick={toPdf}>
						Download License
					</Button>
					}
      		</Pdf>

				</Col>
			</Row>
		);
	}
}

export default AerodromeLicenseCertificate;
