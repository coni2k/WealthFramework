//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace BusinessObjects.Dto
{
    using System;
    using System.ComponentModel.DataAnnotations;

    public class UserLicenseRatingDto
    {
        public UserLicenseRatingDto()
        {
        }

        public UserLicenseRatingDto(UserLicenseRating userLicenseRating)
        {
            this.Id = userLicenseRating.Id;
            this.UserId = userLicenseRating.UserId;
            this.LicenseId = userLicenseRating.LicenseId;
            this.Rating = userLicenseRating.Rating;
            this.CreatedOn = userLicenseRating.CreatedOn;
            this.ModifiedOn = userLicenseRating.ModifiedOn;
            this.DeletedOn = userLicenseRating.DeletedOn;
        }

        [Required]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public short LicenseId { get; set; }

        [Required]
        public decimal Rating { get; set; }

        [Required]
        public System.DateTime CreatedOn { get; set; }

        [Required]
        public System.DateTime ModifiedOn { get; set; }

        public Nullable<System.DateTime> DeletedOn { get; set; }

        public UserLicenseRating ToBusinessObject()
        {
            return new UserLicenseRating()
            {
                Id = Id,
                UserId = UserId,
                LicenseId = LicenseId,
                Rating = Rating,
                CreatedOn = CreatedOn,
                ModifiedOn = ModifiedOn,
                DeletedOn = DeletedOn
            };
        }
    }
}
