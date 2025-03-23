import { IconType } from 'react-icons';
import PropTypes from 'prop-types';

interface IoReturnUpBackOutline {
  icon: IconType;
}
const IconComponent: React.FC<IoReturnUpBackOutline> = ({ icon: Icon }) => {
  return <Icon />;
};
IconComponent.propTypes = {
  icon: PropTypes.func.isRequired,
};
export default IconComponent;
