import styled from 'styled-components';

const ProfileBox = styled.div`
  padding: 16px;
  margin-bottom: 10px;
  ul {
    list-style-type: none;
  }
  li {
    display: flex;
  }
  img {
    height: 20%;
    width: 20%;
    border-radius: 10px;
  }
  a{
    text-decoration: none;
    padding-bottom: 5px;
  }
  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 15px;
  }
  p {
    padding-top: 5px;
  }
`;

export default ProfileBox;